import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check, X } from "lucide-react";
import { AuthService } from "@/services/auth";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    bio: "",
    location: "",
    company: "",
    website: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      errors.username = "Username is required";
    } else if (!AuthService.validateUsername(formData.username)) {
      errors.username = "Username must be 3-20 characters, letters, numbers, and underscores only";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!AuthService.validateEmail(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    const passwordValidation = AuthService.validatePassword(formData.password);
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message;
    }

    // Confirm password validation
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(formData);
      
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, color: "bg-gray-200", text: "" };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500", "bg-green-600"];
    const texts = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    
    return {
      strength: Math.min(strength, 5),
      color: colors[Math.min(strength, 5)],
      text: texts[Math.min(strength, 5)]
    };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>

        {/* Register Card */}
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="854.667"
                height="524"
                version="1"
                viewBox="0 0 641 393"
                className="w-20 h-auto"
              >
                <path
                  d="M481 2644c-37-26-54-77-39-114 7-17 236-270 508-561 272-292 495-537 495-543 0-7-229-239-510-516-280-277-515-513-522-525-36-60 15-145 87-145 25 0 499 189 588 234 439 223 669 722 562 1217-63 293-252 554-507 700-106 60-580 269-612 269-15 0-37-7-50-16zm436-307c68-31 155-77 194-103 170-113 303-288 368-484 24-74 42-162 32-158-6 2-675 718-745 796l-21 23 25-9c14-6 80-35 147-65zm578-1138c-58-222-212-431-407-553-71-44-345-162-355-153-2 3 171 176 384 385s389 380 390 378c1-1-4-27-12-57zM2283 2220c-56-12-96-33-139-77-61-61-85-128-98-271l-11-126-35-8c-19-5-52-14-72-19l-38-10v-129h150V850h190v730h280v170h-282l3 113c4 95 7 117 27 149 39 63 115 80 227 52l26-6-3 68-3 69-35 11c-52 18-139 24-187 14zM4528 1868l-3-122-62-18-63-19v-129h130v-237c0-321 14-396 87-465 58-55 155-72 270-48 74 16 74 16 54 89l-18 64-71-2c-68-2-74-1-102 28l-30 29v542h240v170h-240v240h-189l-3-122z"
                  transform="matrix(.1 0 0 -.1 0 393)"
                ></path>
                <path
                  d="M388 1823c-86-9-105-113-27-141 13-5 120-6 237-3 209 6 214 7 233 30 27 34 24 75-7 100-25 20-38 21-213 19-102-1-203-3-223-5zM2921 1754c-80-21-144-60-205-124-225-236-161-619 129-761 66-32 74-34 180-34 100 0 115 2 161 27 27 14 64 40 81 56l32 29 11-49 12-48h158v900h-156l-13-50-13-50-45 40c-81 71-212 96-332 64zm226-184c195-112 189-448-11-553-57-30-155-29-212 0-50 27-100 82-128 142-32 71-30 207 5 281 49 106 128 159 234 160 48 0 70-6 112-30zM5445 1757c-55-18-106-45-133-70l-22-21-17 42-16 42h-147V850h180v283c0 163 4 298 10 319 41 145 265 198 367 87 44-48 47-70 51-386l4-303h169l-3 333-3 332-26 55c-58 123-157 189-295 196-50 2-94-1-119-9zM3843 1746c-86-28-158-89-192-166-28-61-26-115 4-177 42-84 111-126 287-173 133-37 178-65 178-113 0-88-122-141-242-105-35 10-90 58-100 88-4 13-158-53-158-68 0-25 70-110 113-139 164-109 420-73 526 74 74 102 69 225-13 301-64 59-121 84-308 136-71 20-118 58-118 95 0 111 210 139 268 36 9-17 18-32 19-34 2-2 39 4 83 14 88 20 91 24 61 83-28 54-78 101-141 131-66 31-198 39-267 17zM297 1500l-249-5-24-28c-26-31-30-54-13-90 22-48 34-49 487-42l422 8 25 23c41 38 33 104-16 129-30 16-109 17-632 5zM432 1161c-72-5-86-9-103-30-22-27-23-41-8-74 20-44 45-48 272-41 195 6 214 8 235 27 32 29 30 79-4 106-24 19-39 21-168 19-77-1-179-4-224-7z"
                  transform="matrix(.1 0 0 -.1 0 393)"
                ></path>
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Create your account
            </CardTitle>
            <CardDescription className="text-center">
              Join the Fastn AI Connect community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Message */}
              {isSuccess && (
                <Alert>
                  <AlertDescription>
                    Registration successful! Redirecting...
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Username */}
                <div className="space-y-2">
                  <Label htmlFor="username">Username *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className={`pl-10 ${validationErrors.username ? "border-red-500" : ""}`}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {validationErrors.username && (
                    <p className="text-sm text-red-500 flex items-center">
                      <X className="w-3 h-3 mr-1" />
                      {validationErrors.username}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 ${validationErrors.email ? "border-red-500" : ""}`}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-sm text-red-500 flex items-center">
                      <X className="w-3 h-3 mr-1" />
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange("first_name", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange("last_name", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 pr-10 ${validationErrors.password ? "border-red-500" : ""}`}
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-500 flex items-center">
                      <X className="w-3 h-3 mr-1" />
                      {validationErrors.password}
                    </p>
                  )}
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded ${
                              level <= passwordStrength.strength
                                ? passwordStrength.color
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password strength: {passwordStrength.text}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className={`pl-10 pr-10 ${validationErrors.confirmPassword ? "border-red-500" : ""}`}
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center">
                      <X className="w-3 h-3 mr-1" />
                      {validationErrors.confirmPassword}
                    </p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-sm text-green-500 flex items-center">
                      <Check className="w-3 h-3 mr-1" />
                      Passwords match
                    </p>
                  )}
                </div>
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    type="text"
                    placeholder="Tell us about yourself"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Where are you located?"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    type="text"
                    placeholder="Where do you work?"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="Your website URL"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-primary"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register; 
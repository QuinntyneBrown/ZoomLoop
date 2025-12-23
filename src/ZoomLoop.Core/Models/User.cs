// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class User
{
    public User()
    {
        Email = string.Empty;
        PasswordHash = string.Empty;
        FirstName = string.Empty;
        LastName = string.Empty;
        Roles = [];
        Sessions = [];
        Addresses = [];
    }

    public Guid UserId { get; set; }
    public string Email { get; set; }
    public bool EmailVerified { get; set; }
    public DateTime? EmailVerifiedAt { get; set; }
    public string? Phone { get; set; }
    public bool PhoneVerified { get; set; }
    public DateTime? PhoneVerifiedAt { get; set; }
    public string PasswordHash { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public bool TwoFactorEnabled { get; set; }
    public string? TwoFactorSecret { get; set; }
    public UserStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    public string? EmailVerificationToken { get; set; }
    public DateTime? EmailVerificationTokenExpiry { get; set; }
    public string? PasswordResetToken { get; set; }
    public DateTime? PasswordResetTokenExpiry { get; set; }
    public string? PhoneVerificationCode { get; set; }
    public DateTime? PhoneVerificationCodeExpiry { get; set; }
    public List<Role> Roles { get; set; }
    public List<Session> Sessions { get; set; }
    public List<UserAddress> Addresses { get; set; }
    public UserPreferences? Preferences { get; set; }
}

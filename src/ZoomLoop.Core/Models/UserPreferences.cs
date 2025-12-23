// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class UserPreferences
{
    public Guid UserPreferencesId { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public NotificationPreferences Notifications { get; set; } = new();
    public SearchPreferences Search { get; set; } = new();
    public DateTime UpdatedAt { get; set; }
}

public class NotificationPreferences
{
    public EmailNotifications Email { get; set; } = new();
    public SmsNotifications Sms { get; set; } = new();
    public PushNotifications Push { get; set; } = new();
}

public class EmailNotifications
{
    public bool PurchaseUpdates { get; set; } = true;
    public bool DeliveryNotifications { get; set; } = true;
    public bool PriceAlerts { get; set; } = true;
    public bool NewInventory { get; set; } = true;
    public bool Newsletter { get; set; }
}

public class SmsNotifications
{
    public bool DeliveryDay { get; set; } = true;
    public bool Appointments { get; set; } = true;
    public bool Promotions { get; set; }
}

public class PushNotifications
{
    public bool DeliveryTracking { get; set; } = true;
    public bool FavoriteUpdates { get; set; } = true;
}

public class SearchPreferences
{
    public string? DefaultLocation { get; set; }
    public int DefaultRadius { get; set; } = 50;
    public List<string> PreferredMakes { get; set; } = [];
}

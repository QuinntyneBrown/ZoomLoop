// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.Users.Profile;

public record GetPreferencesRequest : IRequest<GetPreferencesResponse?>;

public record GetPreferencesResponse(
    NotificationPreferencesDto Notifications,
    SearchPreferencesDto Search);

public record NotificationPreferencesDto(
    EmailNotificationsDto Email,
    SmsNotificationsDto Sms,
    PushNotificationsDto Push);

public record EmailNotificationsDto(
    bool PurchaseUpdates,
    bool DeliveryNotifications,
    bool PriceAlerts,
    bool NewInventory,
    bool Newsletter);

public record SmsNotificationsDto(
    bool DeliveryDay,
    bool Appointments,
    bool Promotions);

public record PushNotificationsDto(
    bool DeliveryTracking,
    bool FavoriteUpdates);

public record SearchPreferencesDto(
    string? DefaultLocation,
    int DefaultRadius,
    List<string> PreferredMakes);

// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Email;

public class EmailConfiguration
{
    public string AzureCommunicationServicesConnectionString { get; set; } = string.Empty;
    public string DefaultFromAddress { get; set; } = string.Empty;
}

// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class DigitalAsset
{
    public DigitalAsset()
    {
        Name = string.Empty;
        ContentType = string.Empty;
        Url = string.Empty;
    }

    public Guid DigitalAssetId { get; set; }
    public string Name { get; set; }
    public string ContentType { get; set; }
    public long Size { get; set; }
    public string Url { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
}

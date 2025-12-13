// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System;

namespace ZoomLoop.Core.Security;

public interface IPasswordHasher
{
    string HashPassword(byte[] salt, string password);
}

public class PasswordHasher : IPasswordHasher
{
    public string HashPassword(byte[] salt, string password)
    {
        return Convert.ToBase64String(KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA1,
            iterationCount: 10000,
            numBytesRequested: 256 / 8));
    }
}

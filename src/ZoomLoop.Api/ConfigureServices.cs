// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Text;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ZoomLoop.Api.Behaviours;
using ZoomLoop.Core;
using ZoomLoop.Core.Services.Email;
using ZoomLoop.Core.Services.Financing;
using ZoomLoop.Core.Services.Security;
using ZoomLoop.Core.Services.VehicleIngestion;
using ZoomLoop.Core.Services.VehicleValuation;
using ZoomLoop.Infrastructure;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConfigureServices
{
    public static void AddApiServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor();

        services.AddMediatR(config =>
        {
            config.RegisterServicesFromAssembly(typeof(Program).Assembly);
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehaviour<,>));
            config.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
        });

        // Database configuration
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        services.AddDbContext<ZoomLoopDbContext>(options =>
            options.UseSqlServer(connectionString));

        services.AddScoped<IZoomLoopContext>(provider => provider.GetRequiredService<ZoomLoopDbContext>());
        services.AddScoped<ISeedService, SeedService>();

        var authenticationSection = configuration.GetSection("Authentication");
        var issuer = authenticationSection[nameof(Authentication.JwtIssuer)];
        var audience = authenticationSection[nameof(Authentication.JwtAudience)];
        var key = authenticationSection[nameof(Authentication.JwtKey)];

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = issuer,
                    ValidAudience = audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key ?? string.Empty))
                };
            });

        services.AddAuthorization();

        services.AddSingleton<ITokenProvider, TokenProvider>();
        services.AddSingleton<ITokenBuilder, TokenBuilder>();
        services.AddSingleton<IPasswordHasher, PasswordHasher>();
        services.Configure<Authentication>(authenticationSection);

        // Email services
        var emailSection = configuration.GetSection("Email");
        services.Configure<EmailConfiguration>(emailSection);
        services.AddSingleton<ITemplateEngine, RazorTemplateEngine>();
        services.AddSingleton<IQrCodeGenerator, QrCodeGenerator>();
        services.AddSingleton<IEmailService>(sp =>
        {
            var emailConfig = emailSection.Get<EmailConfiguration>() ?? new EmailConfiguration();
            return new AzureEmailService(
                emailConfig.AzureCommunicationServicesConnectionString,
                emailConfig.DefaultFromAddress);
        });

        // Vehicle Ingestion services
        var vehicleIngestionSection = configuration.GetSection("VehicleIngestion");
        services.Configure<VehicleIngestionConfiguration>(vehicleIngestionSection);
        
        services.AddSingleton<IAzureVisionService>(sp =>
        {
            var config = vehicleIngestionSection.Get<VehicleIngestionConfiguration>() ?? new VehicleIngestionConfiguration();
            return new AzureVisionService(
                config.AzureComputerVisionEndpoint,
                config.AzureComputerVisionKey);
        });
        
        services.AddSingleton<IAzureOpenAIService>(sp =>
        {
            var config = vehicleIngestionSection.Get<VehicleIngestionConfiguration>() ?? new VehicleIngestionConfiguration();
            return new AzureOpenAIService(
                config.AzureOpenAIEndpoint,
                config.AzureOpenAIKey,
                config.AzureOpenAIDeploymentName);
        });
        
        services.AddSingleton<IVehicleIngestionService, VehicleIngestionService>();

        // Vehicle Valuation services
        services.AddSingleton<IVehicleValuationService, VehicleValuationService>();

        // Financing services
        services.AddSingleton<IFinancingCalculator, FinancingCalculator>();

        var allowedOrigins = configuration
            .GetSection("Cors:AllowedOrigins")
            .Get<string[]>() ?? Array.Empty<string>();

        services.AddCors(options => options.AddPolicy("CorsPolicy",
            builder =>
            {
                if (allowedOrigins.Length > 0)
                {
                    builder.WithOrigins(allowedOrigins)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                }
                else
                {
                    builder.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader();
                }
            }));
        services.AddControllers();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
    }
}
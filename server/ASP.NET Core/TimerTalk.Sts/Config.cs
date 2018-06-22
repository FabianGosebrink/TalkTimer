// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

using IdentityServer4.Models;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace TimerTalk.Sts
{
    public class Config
    {
        public static IEnumerable<IdentityResource> GetIdentityResources()
        {
            return new List<IdentityResource>
            {
                new IdentityResources.OpenId(),
                new IdentityResources.Profile(),
                new IdentityResources.Email()
            };
        }

        public static IEnumerable<ApiResource> GetApiResources()
        {
            return new ApiResource[]
            {
                new ApiResource("timertalkclient")
                {
                    ApiSecrets =
                    {
                        new Secret("timerTalkSecret".Sha256())
                    },
                    Scopes =
                    {
                        new Scope
                        {
                            Name = "timer_talk_scope",
                            DisplayName = "Scope for Timer Talk API"
                        }
                    },
                }
            };
        }

        public static IEnumerable<Client> GetClients(IConfigurationSection stsConfig)
        {
            var timerTalkClientUrl = stsConfig["TimerTalkClientUrl"];

            return new List<Client>
            {
                new Client
                {
                    ClientName = "timertalkclient",
                    ClientId = "timertalkclient",
                    AccessTokenType = AccessTokenType.Jwt,
                    AccessTokenLifetime = 330,// 330 seconds, default 60 minutes
                    IdentityTokenLifetime = 30,
                    AllowedGrantTypes = GrantTypes.Implicit,
                    AllowAccessTokensViaBrowser = true,
                    RedirectUris = new List<string>
                    {
                        "https://localhost:4200",
                        "https://localhost:4200/silent-renew.html",
                        $"{timerTalkClientUrl}",
                        $"{timerTalkClientUrl}/silent-renew.html"

                    },
                    PostLogoutRedirectUris = new List<string>
                    {
                        "https://localhost:4200/#/overview",
                        "https://localhost:4200",
                        $"{timerTalkClientUrl}",
                        $"{timerTalkClientUrl}/#/overview"
                    },
                    AllowedCorsOrigins = new List<string>
                    {
                        "https://localhost:4200",
                        $"{timerTalkClientUrl}"
                    },
                    AllowedScopes = new List<string>
                    {
                        "openid",
                        "role",
                        "profile",
                        "offline_access",
                        "email",
                        "timer_talk_scope"
                    }
                }
            };
        }
    }
}
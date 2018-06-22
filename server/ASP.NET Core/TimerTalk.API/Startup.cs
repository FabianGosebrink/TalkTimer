using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TimerTalk.API.Context;
using TimerTalk.API.Dto;
using TimerTalk.API.Models;
using TimerTalk.API.Repositories;

namespace TimerTalk.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var timerTalkStsUrl = Configuration["TimerTalkStsUrl"];

            services.AddDbContext<TimerTalkContext>(options => options.UseSqlite("Data Source=TimerTalk.db"));

            services.AddScoped<ITalksRepository, TalksRepository>();
            services.AddScoped<ITimerTickRepository, TimerTickRepository>();

            services.AddCors(options => options.AddPolicy("CorsPolicy",
                builder =>
                {
                    builder.AllowAnyMethod().AllowAnyHeader()
                        .AllowAnyOrigin()
                        .AllowCredentials();
                }));

            var apiScopeCheckPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .RequireClaim("scope", "timer_talk_scope")
                .Build();

            services.AddAuthentication(IdentityServerAuthenticationDefaults.AuthenticationScheme)
              .AddIdentityServerAuthentication(options =>
              {
                  options.SaveToken = true;
                  options.Authority = timerTalkStsUrl;
                  options.ApiName = "timertalkclient";
                  options.ApiSecret = "timerTalkSecret";
              });

            services.AddAuthorization();

            services.AddMvc(options =>
            {
                options.Filters.Add(new AuthorizeFilter(apiScopeCheckPolicy));
            }).SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            AutoMapper.Mapper.Initialize(mapper =>
            {
                mapper.CreateMap<Talk, TalkDto>().ReverseMap();
                mapper.CreateMap<Talk, TalkCreateDto>().ReverseMap();
                mapper.CreateMap<Talk, TalkUpdateDto>().ReverseMap();
                mapper.CreateMap<TimerTick, TimerTickCreateDto>().ReverseMap();
                mapper.CreateMap<TimerTick, TimerTickDto>().ReverseMap();
                mapper.CreateMap<TimerTick, TimerTickUpdateDto>().ReverseMap();
            });
            app.UseCors("CorsPolicy");
            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseHttpsRedirection();

            app.UseAuthentication();

            app.UseMvc();
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
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

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
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
            app.UseHttpsRedirection();

            app.UseMvc();
        }
    }
}

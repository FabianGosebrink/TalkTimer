using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimerTalk.API.Context;
using TimerTalk.API.Models;

namespace TimerTalk.API.Services
{
    public static class SeedData
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new TimerTalkContext(
                serviceProvider.GetRequiredService<DbContextOptions<TimerTalkContext>>()))
            {
                // Look for any movies.
                if (context.Talks.Any())
                {
                    return;   // DB has been seeded
                }

                context.Talks.AddRange(
                     new Talk
                     {
                         Added = DateTime.Now,
                         Name = "TestName",
                         TimerTicks = new List<TimerTick>()
                     }

                //     new Movie
                //     {
                //         Title = "Ghostbusters ",
                //         ReleaseDate = DateTime.Parse("1984-3-13"),
                //         Genre = "Comedy",
                //         Price = 8.99M
                //     },

                //     new Movie
                //     {
                //         Title = "Ghostbusters 2",
                //         ReleaseDate = DateTime.Parse("1986-2-23"),
                //         Genre = "Comedy",
                //         Price = 9.99M
                //     },

                //   new Movie
                //   {
                //       Title = "Rio Bravo",
                //       ReleaseDate = DateTime.Parse("1959-4-15"),
                //       Genre = "Western",
                //       Price = 3.99M
                //   }
                );
                context.SaveChanges();
            }
        }
    }
}

using Microsoft.EntityFrameworkCore;
using TimerTalk.API.Models;

namespace TimerTalk.API.Context
{
    public class TimerTalkContext : DbContext
    {
        public TimerTalkContext(DbContextOptions<TimerTalkContext> options)
            : base(options)
        {
        }

        public DbSet<Talk> Talks { get; set; }
        public DbSet<TimerTick> TimerTicks { get; set; }
    }
}

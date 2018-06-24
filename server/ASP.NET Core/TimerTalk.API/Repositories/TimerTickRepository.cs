using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimerTalk.API.Context;
using TimerTalk.API.Models;

namespace TimerTalk.API.Repositories
{
    public class TimerTickRepository : ITimerTickRepository
    {
        TimerTalkContext _timerTalkContext;

        public TimerTickRepository(TimerTalkContext foodDbContext)
        {
            _timerTalkContext = foodDbContext;
        }

        public void Add(TimerTick item)
        {
            _timerTalkContext.TimerTicks.Add(item);
        }

        public int Count(string userId)
        {
            return _timerTalkContext.TimerTicks.Where(x => x.UserId == userId).Count();
        }

        public void Delete(int id, string userId)
        {
            TimerTick toRemove = GetSingle(id, userId);
            _timerTalkContext.TimerTicks.Remove(toRemove);
        }

        public IQueryable<TimerTick> GetAll(string userId)
        {
            return _timerTalkContext.TimerTicks.Where(x => x.UserId == userId);
        }

        public TimerTick GetSingle(int id, string userId)
        {
            return _timerTalkContext.TimerTicks.FirstOrDefault(x => x.Id == id && x.UserId == userId);
        }

        public bool Save()
        {
            return (_timerTalkContext.SaveChanges() >= 0);
        }

        public void Update(TimerTick item)
        {
            _timerTalkContext.TimerTicks.Update(item);
        }
    }
}

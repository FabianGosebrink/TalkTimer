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

        public int Count()
        {
            return _timerTalkContext.TimerTicks.Count();
        }

        public void Delete(Guid id)
        {
            TimerTick toRemove = GetSingle(id);
            _timerTalkContext.TimerTicks.Remove(toRemove);
        }

        public IQueryable<TimerTick> GetAll()
        {
            return _timerTalkContext.TimerTicks;
        }

        public TimerTick GetSingle(Guid id)
        {
            return _timerTalkContext.TimerTicks.FirstOrDefault(x => x.Id == id);
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

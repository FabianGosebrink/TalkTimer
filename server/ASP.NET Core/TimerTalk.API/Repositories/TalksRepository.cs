using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TimerTalk.API.Context;
using TimerTalk.API.Models;

namespace TimerTalk.API.Repositories
{
    public class TalksRepository : ITalksRepository
    {
        private readonly TimerTalkContext _timerTalkContext;

        public TalksRepository(TimerTalkContext timerTalkContext)
        {
            _timerTalkContext = timerTalkContext;
        }

        public Talk GetSingle(Guid id)
        {
            return _timerTalkContext.Talks.FirstOrDefault(x => x.Id == id);
        }

        public void Add(Talk item)
        {
            _timerTalkContext.Talks.Add(item);
        }

        public void Delete(Guid id)
        {
            Talk item = GetSingle(id);
            _timerTalkContext.Talks.Remove(item);
        }

        public void Update(Talk item)
        {
            _timerTalkContext.Talks.Update(item);
        }

        public IQueryable<Talk> GetAll()
        {
            return _timerTalkContext.Talks;
        }

        public int Count()
        {
            return _timerTalkContext.Talks.Count();
        }

        public bool Save()
        {
            return (_timerTalkContext.SaveChanges() >= 0);
        }
    }

}

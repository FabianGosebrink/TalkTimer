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

        public Talk GetSingle(int id, string userId)
        {
            return _timerTalkContext.Talks.FirstOrDefault(x => x.Id == id && x.UserId == userId);
        }

        public void Add(Talk item)
        {
            _timerTalkContext.Talks.Add(item);
        }

        public void Delete(int id, string userId)
        {
            Talk item = GetSingle(id, userId);
            _timerTalkContext.Talks.Remove(item);
        }

        public void Update(Talk item)
        {
            _timerTalkContext.Talks.Update(item);
        }

        public IQueryable<Talk> GetAll(string userId)
        {
            return _timerTalkContext.Talks.Where(x => x.UserId == userId);
        }

        public int Count(string userId)
        {
            return _timerTalkContext.Talks.Where(x => x.UserId == userId).Count();
        }

        public bool Save()
        {
            return (_timerTalkContext.SaveChanges() >= 0);
        }
    }

}

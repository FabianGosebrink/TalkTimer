using System;
using System.Linq;
using TimerTalk.API.Models;

namespace TimerTalk.API.Repositories
{
    public interface ITimerTickRepository
    {
        void Add(TimerTick item);
        int Count();
        void Delete(int id);
        IQueryable<TimerTick> GetAll();
        TimerTick GetSingle(int id);
        bool Save();
        void Update(TimerTick item);
    }
}
using System;
using System.Linq;
using TimerTalk.API.Models;

namespace TimerTalk.API.Repositories
{
    public interface ITimerTickRepository
    {
        void Add(TimerTick item);
        int Count(string userId);
        void Delete(int id, string userId);
        IQueryable<TimerTick> GetAll(string userId);
        TimerTick GetSingle(int id, string userId);
        bool Save();
        void Update(TimerTick item);
    }
}
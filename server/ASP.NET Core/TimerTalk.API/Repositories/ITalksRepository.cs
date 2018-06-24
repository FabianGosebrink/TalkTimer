using System;
using System.Linq;
using TimerTalk.API.Context;
using TimerTalk.API.Models;

namespace TimerTalk.API.Repositories
{
    public interface ITalksRepository
    {
        void Add(Talk item);
        int Count(string userId);
        void Delete(int id, string userId);
        IQueryable<Talk> GetAll(string userId);
        Talk GetSingle(int id, string userId);
        bool Save();
        void Update(Talk item);
    }
}
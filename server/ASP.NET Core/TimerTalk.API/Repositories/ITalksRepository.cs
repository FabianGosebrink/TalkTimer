using System;
using System.Linq;
using TimerTalk.API.Context;
using TimerTalk.API.Models;

namespace TimerTalk.API.Repositories
{
    public interface ITalksRepository
    {
        void Add(Talk item);
        int Count();
        void Delete(Guid id);
        IQueryable<Talk> GetAll();
        Talk GetSingle(Guid id);
        bool Save();
        void Update(Talk item);
    }
}
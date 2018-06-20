using System;
using TimerTalk.API.Models;

namespace TimerTalk.API
{
    public class TimerTickDto
    {
        public Guid Id { get; set; }
        public string Topic { get; set; }
        public int IntervalSeconds { get; set; }
        public int SecondsLeft { get; set; }

        public int TalkId { get; set; }
        public Talk Talk { get; set; }
    }
}

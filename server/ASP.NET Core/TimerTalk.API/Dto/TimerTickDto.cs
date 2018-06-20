using System;
using TimerTalk.API.Models;

namespace TimerTalk.API.Dto
{
    public class TimerTickDto
    {
        public int Id { get; set; }
        public string Topic { get; set; }
        public int IntervalSeconds { get; set; }
        public int SecondsLeft { get; set; }

        public int TalkId { get; set; }
    }
}

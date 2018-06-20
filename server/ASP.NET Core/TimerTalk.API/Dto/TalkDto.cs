using System;
using System.Collections.Generic;
using TimerTalk.API.Models;

namespace TimerTalk.API
{
    public class TalkDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateTime Added { get; set; }

        public List<TimerTickDto> TimerTicks { get; set; }
    }
}

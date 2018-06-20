using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using TimerTalk.API.Dto;
using TimerTalk.API.Models;
using TimerTalk.API.Repositories;

namespace TimerTalk.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TalksController : ControllerBase
    {
        private readonly ITalksRepository _talksRepository;

        public TalksController(ITalksRepository talksRepository)
        {
            _talksRepository = talksRepository;
        }

        [HttpGet(Name = nameof(GetAll))]
        public IActionResult GetAll()
        {
            List<Talk> talks = _talksRepository.GetAll().ToList();

            var toReturn = talks.Select(x => AutoMapper.Mapper.Map<TalkDto>(x));

            return Ok(toReturn);
        }

        [HttpPost(Name = nameof(Add))]
        public IActionResult Add([FromBody] TalkCreateDto talkCreateDto)
        {
            if (talkCreateDto == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Talk toAdd = AutoMapper.Mapper.Map<Talk>(talkCreateDto);
            toAdd.Added = DateTime.UtcNow;
            toAdd.TimerTicks = new List<TimerTick>();
            _talksRepository.Add(toAdd);

            if (!_talksRepository.Save())
            {
                throw new Exception("Creating an item failed on save.");
            }

            Talk newItem = _talksRepository.GetSingle(toAdd.Id);

            return CreatedAtRoute(nameof(GetSingle), new { id = newItem.Id },
                AutoMapper.Mapper.Map<TalkDto>(newItem));
        }



        [HttpGet]
        [Route("{id}", Name = nameof(GetSingle))]
        public IActionResult GetSingle(int id)
        {
            Talk talk = _talksRepository.GetSingle(id);

            if (talk == null)
            {
                return NotFound();
            }

            return Ok(AutoMapper.Mapper.Map<TalkDto>(talk));
        }

        [HttpDelete]
        [Route("{id}", Name = nameof(Remove))]
        public IActionResult Remove(int id)
        {
            Talk talk = _talksRepository.GetSingle(id);

            if (talk == null)
            {
                return NotFound();
            }

            _talksRepository.Delete(id);

            if (!_talksRepository.Save())
            {
                throw new Exception("Deleting a fooditem failed on save.");
            }

            return NoContent();
        }

        [HttpPut]
        [Route("{id}", Name = nameof(Update))]
        public IActionResult Update(int id, [FromBody]TalkUpdateDto talkUpdateDto)
        {
            if (talkUpdateDto == null)
            {
                return BadRequest();
            }

            Talk existingTalk = _talksRepository.GetSingle(id);

            if (existingTalk == null)
            {
                return NotFound();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            AutoMapper.Mapper.Map(talkUpdateDto, existingTalk);

            _talksRepository.Update(existingTalk);

            if (!_talksRepository.Save())
            {
                throw new Exception("Updating a fooditem failed on save.");
            }
            
            return Ok(AutoMapper.Mapper.Map<TalkDto>(existingTalk));
        }
    }
}

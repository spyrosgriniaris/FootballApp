using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using FootballApp.API.Data;
using FootballApp.API.Dtos;
using FootballApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FootballApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class MembersController : ControllerBase
    {
        private readonly IMemberRepository _memberRepo;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        public MembersController(IMemberRepository memberRepo, UserManager<User> userManager, IMapper mapper)
        {
            _mapper = mapper;
            _userManager = userManager;
            _memberRepo = memberRepo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _memberRepo.GetUsers();

            var usersToReturn = _mapper.Map<IEnumerable<MemberForListDto>>(users);

            return Ok(usersToReturn);
        }

        //http://localhost:5000/api/members/1
        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _memberRepo.GetUser(id);

            var userToReturn = _mapper.Map<MemberForDetailedDto>(user);

            return Ok(userToReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMember(int id, MemberForUpdateDto memberForUpdateDto) {
            // check if parameter's id equals the id that is part of the token
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            var userFromRepo = await _memberRepo.GetUser(id);

            _mapper.Map(memberForUpdateDto, userFromRepo);

            if (await _memberRepo.SaveAll()){
                return NoContent();
            }
            throw new Exception($"Updating user {id} failed on save");
        }
    }
}
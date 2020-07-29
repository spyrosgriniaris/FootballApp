using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using FootballApp.API.Data;
using FootballApp.API.Data.Members;
using FootballApp.API.Dtos;
using FootballApp.API.Helpers;
using FootballApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace FootballApp.API.Controllers
{
    [AllowAnonymous]
    [Route("api/members/{memberId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;
        private readonly UserManager<User> _userManager;
        public PhotosController(IMemberRepository memberRepository, UserManager<User> userManager,
         IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _userManager = userManager;
            _cloudinaryConfig = cloudinaryConfig;
            _mapper = mapper;
            _memberRepository = memberRepository;

            // need options for cloudinary configuration
            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(acc);
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _memberRepository.GetPhoto(id);

            // Dto for returning the photo
            var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);

            return Ok(photo);
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm]PhotoForCreationDto photoForCreationDto)
        {
            //check if id of logged user equals if of route
            User user = await _userManager.GetUserAsync(User);

            var memberFromRepo = await _memberRepository.GetUser(user.Id);

            if(memberFromRepo == null)
                return Unauthorized();

            var file = photoForCreationDto.File;

            var uploadResult = new ImageUploadResult();

            if (file.Length > 0)
            {
                // to using xrisimopoieitai gia na ginei dispose oti uparxei sti mnimi molis teleiwsei i ektelesi
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    uploadResult = _cloudinary.Upload(uploadParams);
                }
            }
            photoForCreationDto.Url = uploadResult.Url.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;


            var photo = _mapper.Map<Photo>(photoForCreationDto);

            if(!memberFromRepo.Photos.Any(u => u.isMain))
                photo.isMain = true;

            memberFromRepo.Photos.Add(photo);


            if (await _memberRepository.SaveAll())
            {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                // ftiaxnw tin getPhoto panw
                return CreatedAtRoute("GetPhoto", new { memberId = userId, id = photo.Id }, photoToReturn);
            }

            return BadRequest("Could not add the photo");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> setMainPhoto(int userId, int id) {

            User user = await _userManager.GetUserAsync(User);

            var memberFromRepo = await _memberRepository.GetUser(user.Id);

            if(memberFromRepo == null)
                return Unauthorized();
            
            var photoFromRepo = await _memberRepository.GetPhoto(id);

            if(photoFromRepo.isMain)
                return BadRequest("Photo is already main");

            var curPhoto = memberFromRepo.Photos.FirstOrDefault(p => p.isMain);
            curPhoto.isMain = false;

            photoFromRepo.isMain = true;

            if (await _memberRepository.SaveAll())
                return NoContent();
            
            return BadRequest("Could not set photo to main");

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id){
            User user = await _userManager.GetUserAsync(User);

            var memberFromRepo = await _memberRepository.GetUser(user.Id);

            if(memberFromRepo == null)
                return Unauthorized();
            // elegxw an prospathei na epeksergastei fwtografia pou anikei ston idio

            if (!user.Photos.Any(p => p.Id == id))
                return Unauthorized();
            
            var photoFromRepo = await _memberRepository.GetPhoto(id);

            if (photoFromRepo.isMain)
                return BadRequest("You cannot delete your main photo");
            if (photoFromRepo.PublicId != null) {
                // tha prepei na svisw ti photo apo to cloudinary kai to reference tis apo tin vasi mou
                // create deletion params needed
                var deleteParams = new DeletionParams(photoFromRepo.PublicId);
                // response of cloudinary is a string
                var result = _cloudinary.Destroy(deleteParams);
                if (result.Result == "ok"){
                    _memberRepository.Delete(photoFromRepo);
                }
            }
            if (photoFromRepo.PublicId == null){
                 _memberRepository.Delete(photoFromRepo);
            }
            
            if (await _memberRepository.SaveAll())
                return Ok();
                
            return BadRequest("Failed to delete the Photo");
        }
    }
}
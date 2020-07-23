using System.Linq;
using AutoMapper;
using FootballApp.API.Dtos;
using FootballApp.API.Models;

namespace FootballApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
       public AutoMapperProfiles()
       {
           CreateMap<User, MemberForListDto>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.isMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

            CreateMap<User,MemberForDetailedDto>()
                .ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.isMain).Url))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => src.DateOfBirth.CalculateAge()));

            CreateMap<Photo, PhotosForDetailedDto>();
       }
    }
}
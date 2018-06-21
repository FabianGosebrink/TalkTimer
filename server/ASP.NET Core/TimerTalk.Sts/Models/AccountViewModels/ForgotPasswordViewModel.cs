using System.ComponentModel.DataAnnotations;

namespace TimerTalk.Sts.Models.AccountViewModels
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}

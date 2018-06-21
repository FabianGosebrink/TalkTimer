using System.Security.Cryptography.X509Certificates;

namespace TimerTalk.Sts.Services.Certificate
{
    public interface ICertificateService
    {
        X509Certificate2 GetCertificateFromKeyVault(string vaultCertificateName);
    }
}
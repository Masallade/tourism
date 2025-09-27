<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ServiceProviderPendingMail extends Mailable
{
    use Queueable, SerializesModels;

    public $providerName;

    public function __construct($providerName)
    {
        $this->providerName = $providerName;
    }

    public function build()
    {
        return $this->subject('Your Service Provider Request is Pending')
            ->view('emails.service_provider_pending')
            ->with([
                'providerName' => $this->providerName,
            ]);
    }
}

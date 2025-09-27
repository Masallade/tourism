<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ServiceProviderStatusMail extends Mailable
{
    use Queueable, SerializesModels;

    public $status;
    public $password;

    /**
     * Create a new message instance.
     */
    public function __construct($status, $password = null)
    {
        $this->status = $status;
        $this->password = $password;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        if ($this->status === 'approved') {
            return $this->subject('Your Service Provider Request Approved')
                ->view('emails.service_provider_approved')
                ->with([
                    'password' => $this->password,
                ]);
        } else {
            return $this->subject('Your Service Provider Request Rejected')
                ->view('emails.service_provider_rejected');
        }
    }
}

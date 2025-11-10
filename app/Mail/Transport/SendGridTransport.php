<?php

namespace App\Mail\Transport;

use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\MessageConverter;
use Illuminate\Support\Facades\Http;

class SendGridTransport extends AbstractTransport
{
    protected $apiKey;

    public function __construct($apiKey)
    {
        $this->apiKey = $apiKey;
        parent::__construct();
    }

    protected function doSend(SentMessage $message): void
    {
        \Log::info('SendGridTransport: Starting email send');
        
        try {
            $email = MessageConverter::toEmail($message->getOriginalMessage());
            
            $toAddresses = $this->convertAddresses($email->getTo());
            $fromAddress = $this->convertAddress($email->getFrom()[0]);
            $subject = $email->getSubject() ?? '';
            
            \Log::info('SendGridTransport: Email details', [
                'to' => $toAddresses,
                'from' => $fromAddress,
                'subject' => $subject,
            ]);
            
            $htmlBody = $email->getHtmlBody();
            $textBody = $email->getTextBody();
            
            $content = [];
            if ($htmlBody) {
                $content[] = [
                    'type' => 'text/html',
                    'value' => $htmlBody,
                ];
                \Log::info('SendGridTransport: HTML body found', ['length' => strlen($htmlBody)]);
            }
            if ($textBody) {
                $content[] = [
                    'type' => 'text/plain',
                    'value' => $textBody,
                ];
                \Log::info('SendGridTransport: Text body found', ['length' => strlen($textBody)]);
            }
            
            // If no content, use empty string
            if (empty($content)) {
                $content[] = [
                    'type' => 'text/plain',
                    'value' => '',
                ];
                \Log::warning('SendGridTransport: No email content found, using empty string');
            }
            
            $payload = [
                'personalizations' => [
                    [
                        'to' => $toAddresses,
                        'subject' => $subject,
                    ],
                ],
                'from' => $fromAddress,
                'content' => $content,
            ];

            // Add CC if present
            if (count($email->getCc()) > 0) {
                $payload['personalizations'][0]['cc'] = $this->convertAddresses($email->getCc());
                \Log::info('SendGridTransport: CC addresses added', ['cc' => $payload['personalizations'][0]['cc']]);
            }

            // Add BCC if present
            if (count($email->getBcc()) > 0) {
                $payload['personalizations'][0]['bcc'] = $this->convertAddresses($email->getBcc());
                \Log::info('SendGridTransport: BCC addresses added');
            }

            // Add reply-to if present
            if (count($email->getReplyTo()) > 0) {
                $payload['reply_to'] = $this->convertAddress($email->getReplyTo()[0]);
                \Log::info('SendGridTransport: Reply-to added', ['reply_to' => $payload['reply_to']]);
            }

            \Log::info('SendGridTransport: Sending request to SendGrid API', [
                'url' => 'https://api.sendgrid.com/v3/mail/send',
                'api_key_prefix' => substr($this->apiKey, 0, 10) . '...',
            ]);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://api.sendgrid.com/v3/mail/send', $payload);

            \Log::info('SendGridTransport: Response received', [
                'status' => $response->status(),
                'successful' => $response->successful(),
            ]);

            if (!$response->successful()) {
                $errorBody = $response->body();
                \Log::error('SendGridTransport: API error', [
                    'status' => $response->status(),
                    'body' => $errorBody,
                ]);
                throw new \Exception('SendGrid API error (Status: ' . $response->status() . '): ' . $errorBody);
            }
            
            \Log::info('SendGridTransport: Email sent successfully', [
                'to' => $toAddresses,
                'subject' => $subject,
            ]);
            
        } catch (\Exception $e) {
            \Log::error('SendGridTransport: Exception during send', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    protected function convertAddresses(array $addresses): array
    {
        return array_map(function ($address) {
            return $this->convertAddress($address);
        }, $addresses);
    }

    protected function convertAddress($address): array
    {
        return [
            'email' => $address->getAddress(),
            'name' => $address->getName(),
        ];
    }

    public function __toString(): string
    {
        return 'sendgrid';
    }
}


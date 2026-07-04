<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Please check the required fields and try again.'
    ]);
    exit;
}

/*
|--------------------------------------------------------------------------
| Eavora contact settings
|--------------------------------------------------------------------------
| Change this email to the real receiving mailbox before production launch.
*/
$recipientEmail = 'support@eavora.com';
$siteName = 'Eavora';
$fromEmail = 'no-reply@eavora.com';

function respond(bool $success, string $message, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);
    exit;
}

function cleanInput(?string $value, int $maxLength = 1000): string
{
    $value = trim((string) $value);
    $value = str_replace(["\r", "\n"], ' ', $value);
    $value = strip_tags($value);
    $value = htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength, 'UTF-8');
    }

    return substr($value, 0, $maxLength);
}

function cleanMessage(?string $value, int $maxLength = 4000): string
{
    $value = trim((string) $value);
    $value = strip_tags($value);
    $value = htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength, 'UTF-8');
    }

    return substr($value, 0, $maxLength);
}

function hasHeaderInjection(string $value): bool
{
    return (bool) preg_match('/[\r\n]/', $value);
}

$honeypot = trim((string) ($_POST['website'] ?? ''));

if ($honeypot !== '') {
    respond(true, 'Thank you. Your request has been received.');
}

$formStartedAt = (string) ($_POST['formStartedAt'] ?? '');

if ($formStartedAt !== '' && ctype_digit($formStartedAt)) {
    $startedSeconds = ((int) $formStartedAt) / 1000;
    $elapsedSeconds = time() - $startedSeconds;

    if ($elapsedSeconds < 2) {
        respond(false, 'Please check the required fields and try again.', 400);
    }
}

$fullName = cleanInput($_POST['fullName'] ?? '', 120);
$email = trim((string) ($_POST['email'] ?? ''));
$phone = cleanInput($_POST['phone'] ?? '', 80);
$service = cleanInput($_POST['service'] ?? '', 160);
$message = cleanMessage($_POST['message'] ?? '', 4000);
$sourcePage = cleanInput($_POST['sourcePage'] ?? 'Website contact form', 180);
$privacyConsent = trim((string) ($_POST['privacyConsent'] ?? ''));

if (
    $fullName === '' ||
    $email === '' ||
    $service === '' ||
    $privacyConsent === ''
) {
    respond(false, 'Please check the required fields and try again.', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || hasHeaderInjection($email)) {
    respond(false, 'Please check the required fields and try again.', 400);
}

if (hasHeaderInjection($fullName) || hasHeaderInjection($service) || hasHeaderInjection($phone)) {
    respond(false, 'Please check the required fields and try again.', 400);
}

$allowedConsentValues = ['yes', 'on', 'true', '1'];

if (!in_array(strtolower($privacyConsent), $allowedConsentValues, true)) {
    respond(false, 'Please check the required fields and try again.', 400);
}

$submittedAt = date('Y-m-d H:i:s');
$userIp = $_SERVER['REMOTE_ADDR'] ?? 'Unavailable';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unavailable';

$subject = 'New Eavora gutter request';
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$emailBody = <<<EMAIL
New request received from the Eavora website.

Name:
{$fullName}

Email:
{$email}

Phone:
{$phone}

Service Category:
{$service}

Message:
{$message}

Source Page:
{$sourcePage}

Privacy Consent:
{$privacyConsent}

Submitted At:
{$submittedAt}

IP Address:
{$userIp}

User Agent:
{$userAgent}

Platform Notice:
Eavora is an independent provider-matching platform. Eavora does not perform gutter work directly. Participating providers are independent, and final pricing, scheduling, warranties, availability, and service terms are provider-supplied.
EMAIL;

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: ' . $siteName . ' <' . $fromEmail . '>',
    'Reply-To: ' . $fullName . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion()
];

$mailSent = @mail(
    $recipientEmail,
    $encodedSubject,
    $emailBody,
    implode("\r\n", $headers)
);

if (!$mailSent) {
    respond(false, 'Please check the required fields and try again.', 500);
}

respond(true, 'Thank you. Your request has been received.');

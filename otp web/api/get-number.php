<?php

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'POST request required'
    ]);
    exit;
}

$apiKey = 'ZNX_03CZSLDHHSW41IZWV61X8850';

$input = json_decode(file_get_contents('php://input'), true);

$country = (string) ($input['country'] ?? '');

$countryRanges = [
    '261' => ['name' => 'Madagascar', 'range' => '261344XXX'],
    '224' => ['name' => 'Guinea', 'range' => '224678XXX'],
    '382' => ['name' => 'Montenegro', 'range' => '382679XXX'],
    '380' => ['name' => 'Ukraine', 'range' => '380913XXX'],
    '992' => ['name' => 'Tajikistan', 'range' => '992778XXX'],
    '232' => ['name' => 'Sierra Leone', 'range' => '232765XXX'],
    '44' => ['name' => 'United Kingdom', 'range' => '447384XXX'],
    '374' => ['name' => 'Armenia', 'range' => '374959XXX'],
];

if ($country !== 'any' && !isset($countryRanges[$country])) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Numbers are not available for the selected country.'
    ]);
    exit;
}

$candidates = $country === 'any'
    ? array_values($countryRanges)
    : [$countryRanges[$country]];

if ($country === 'any') {
    shuffle($candidates);
}

function makePostRequest($url, $data, $apiKey) {
    $payload = json_encode($data);

    // 1. Try PHP cURL extension
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json',
            'mapikey: ' . $apiKey
        ]);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($response !== false && !empty($response)) {
            return ['success' => true, 'http_code' => $httpCode, 'body' => $response];
        }
    }

    // 2. Try PHP stream context (file_get_contents with OpenSSL wrapper)
    $options = [
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/json\r\n" .
                         "Accept: application/json\r\n" .
                         "mapikey: " . $apiKey . "\r\n",
            'content' => $payload,
            'timeout' => 15,
            'ignore_errors' => true
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false
        ]
    ];
    $context  = stream_context_create($options);
    $response = @file_get_contents($url, false, $context);

    if ($response !== false && !empty($response)) {
        $httpCode = 200;
        if (isset($http_response_header[0]) && preg_match('/HTTP\/\d\.\d\s+(\d+)/', $http_response_header[0], $matches)) {
            $httpCode = (int)$matches[1];
        }
        return ['success' => true, 'http_code' => $httpCode, 'body' => $response];
    }

    // 3. Fallback to CLI curl command
    if (function_exists('exec')) {
        $tmpFile = tempnam(sys_get_temp_dir(), 'post_');
        file_put_contents($tmpFile, $payload);
        $cmd = sprintf('curl -s -k -X POST %s -H %s -H %s -d @%s',
            escapeshellarg($url),
            escapeshellarg('Content-Type: application/json'),
            escapeshellarg('mapikey: ' . $apiKey),
            escapeshellarg($tmpFile)
        );
        $output = [];
        $returnCode = 0;
        @exec($cmd, $output, $returnCode);
        @unlink($tmpFile);

        if ($returnCode === 0 && !empty($output)) {
            $response = implode("\n", $output);
            return ['success' => true, 'http_code' => 200, 'body' => $response];
        }
    }

    return ['success' => false, 'error' => 'HTTP request failed across all transport layers (cURL extension, OpenSSL stream, and CLI curl).'];
}

$lastError = null;

foreach ($candidates as $selectedCountry) {
    $data = [
        'range' => $selectedCountry['range'],
        'is_national' => false,
        'remove_plus' => false
    ];

    $res = makePostRequest('https://api.zenexnetwork.com/v1/getnum', $data, $apiKey);
    if (!$res['success']) {
        $lastError = $res['error'];
        continue;
    }

    $httpCode = $res['http_code'];
    $zenexResponse = json_decode($res['body'], true);

    if ($httpCode >= 200 && $httpCode < 300 && ($zenexResponse['meta']['status'] ?? '') === 'success' && !empty($zenexResponse['data']['number'])) {
        echo json_encode([
            'success' => true,
            'http_code' => $httpCode,
            'requested_country' => $selectedCountry['name'],
            'zenex_response' => $zenexResponse
        ]);
        exit;
    } else {
        if (!empty($zenexResponse['message'])) {
            $lastError = $zenexResponse['message'];
        } elseif (!empty($zenexResponse['meta']['message'])) {
            $lastError = $zenexResponse['meta']['message'];
        }
    }
}

http_response_code(503);
echo json_encode([
    'success' => false,
    'message' => $lastError ?? ($country === 'any'
        ? 'No numbers are currently available in any configured country.'
        : 'Numbers are not currently available for the selected country.')
]);



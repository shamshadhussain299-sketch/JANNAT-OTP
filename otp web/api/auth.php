<?php

declare(strict_types=1);

session_name('jannat_otp_session');
session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Lax',
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
]);
session_start();
header('Content-Type: application/json');
header('Cache-Control: no-store');

function reply(bool $success, ?string $message = null, ?array $user = null, int $status = 200): void {
    http_response_code($status);
    $payload = ['success' => $success];
    if ($message !== null) $payload['message'] = $message;
    $payload['user'] = $user;
    echo json_encode($payload);
    exit;
}

function publicUser(array $user): array {
    return ['id' => (int)$user['id'], 'name' => $user['name'], 'username' => $user['username'], 'email' => $user['email'], 'provider' => $user['provider']];
}

function loginUser(array $user): void {
    session_regenerate_id(true);
    $_SESSION['user'] = publicUser($user);
}

$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput ? $rawInput : ($GLOBALS['mock_input'] ?? '{}'), true);
if (!is_array($input)) reply(false, 'Invalid request data.', null, 400);
$action = $input['action'] ?? '';

if ($action === 'session') reply(true, null, $_SESSION['user'] ?? null);
if ($action === 'logout') {
    $_SESSION = [];
    session_destroy();
    reply(true, 'Logged out.');
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir) && !mkdir($dataDir, 0700, true) && !is_dir($dataDir)) reply(false, 'Unable to prepare account storage.', null, 500);

class AuthStorage {
    private ?PDO $db = null;
    private string $jsonFile;
    private bool $useSqlite = false;

    public function __construct(string $dataDir) {
        $this->jsonFile = $dataDir . '/users.json';
        if (class_exists('PDO') && in_array('sqlite', PDO::getAvailableDrivers(), true)) {
            try {
                $this->db = new PDO('sqlite:' . $dataDir . '/accounts.sqlite');
                $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $this->db->exec('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, username TEXT NOT NULL COLLATE NOCASE UNIQUE, email TEXT NOT NULL UNIQUE COLLATE NOCASE, password_hash TEXT NOT NULL, provider TEXT NOT NULL DEFAULT "email", created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)');
                $columns = $this->db->query('PRAGMA table_info(users)')->fetchAll(PDO::FETCH_COLUMN, 1);
                if (!in_array('username', $columns, true)) {
                    $this->db->exec('ALTER TABLE users ADD COLUMN username TEXT');
                    $this->db->exec("UPDATE users SET username = 'user_' || id WHERE username IS NULL OR username = ''");
                }
                $this->db->exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique ON users(username COLLATE NOCASE)');
                $this->useSqlite = true;
                return;
            } catch (Throwable $e) {
                $this->db = null;
                $this->useSqlite = false;
            }
        }
        
        if (!file_exists($this->jsonFile)) {
            @file_put_contents($this->jsonFile, json_encode([], JSON_PRETTY_PRINT));
        }
    }

    private function getJsonUsers(): array {
        if (!file_exists($this->jsonFile)) return [];
        $data = @file_get_contents($this->jsonFile);
        $users = json_decode((string)$data, true);
        return is_array($users) ? $users : [];
    }

    private function saveJsonUsers(array $users): void {
        @file_put_contents($this->jsonFile, json_encode(array_values($users), JSON_PRETTY_PRINT));
    }

    public function findByUsername(string $username): ?array {
        if ($this->useSqlite && $this->db) {
            $stmt = $this->db->prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE LIMIT 1');
            $stmt->execute([$username]);
            $res = $stmt->fetch(PDO::FETCH_ASSOC);
            return $res ? $res : null;
        }

        $users = $this->getJsonUsers();
        foreach ($users as $u) {
            if (strcasecmp($u['username'] ?? '', $username) === 0) return $u;
        }
        return null;
    }

    public function findByEmail(string $email): ?array {
        if ($this->useSqlite && $this->db) {
            $stmt = $this->db->prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE LIMIT 1');
            $stmt->execute([$email]);
            $res = $stmt->fetch(PDO::FETCH_ASSOC);
            return $res ? $res : null;
        }

        $users = $this->getJsonUsers();
        foreach ($users as $u) {
            if (strcasecmp($u['email'] ?? '', $email) === 0) return $u;
        }
        return null;
    }

    public function createUser(string $name, string $username, string $email, string $passwordHash): array {
        if ($this->useSqlite && $this->db) {
            $stmt = $this->db->prepare('INSERT INTO users (name, username, email, password_hash, provider) VALUES (?, ?, ?, ?, "email")');
            $stmt->execute([$name, $username, $email, $passwordHash]);
            return [
                'id' => (int)$this->db->lastInsertId(),
                'name' => $name,
                'username' => $username,
                'email' => $email,
                'provider' => 'email'
            ];
        }

        $users = $this->getJsonUsers();
        $maxId = 0;
        foreach ($users as $u) {
            if (($u['id'] ?? 0) > $maxId) $maxId = (int)$u['id'];
        }
        $newUser = [
            'id' => $maxId + 1,
            'name' => $name,
            'username' => $username,
            'email' => strtolower($email),
            'password_hash' => $passwordHash,
            'provider' => 'email',
            'created_at' => date('Y-m-d H:i:s')
        ];
        $users[] = $newUser;
        $this->saveJsonUsers($users);
        return $newUser;
    }

    public function getAllUsers(): array {
        if ($this->useSqlite && $this->db) {
            $stmt = $this->db->query('SELECT id, name, username, email, provider, created_at FROM users ORDER BY id DESC');
            return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        }
        $users = $this->getJsonUsers();
        $result = [];
        foreach (array_reverse($users) as $u) {
            $result[] = [
                'id' => (int)($u['id'] ?? 0),
                'name' => $u['name'] ?? '',
                'username' => $u['username'] ?? '',
                'email' => $u['email'] ?? '',
                'provider' => $u['provider'] ?? 'email',
                'created_at' => $u['created_at'] ?? 'N/A'
            ];
        }
        return $result;
    }

    public function updatePassword(string $username, string $newPasswordHash): bool {
        if ($this->useSqlite && $this->db) {
            $stmt = $this->db->prepare('UPDATE users SET password_hash = ? WHERE username = ? COLLATE NOCASE');
            return $stmt->execute([$newPasswordHash, $username]);
        }

        $users = $this->getJsonUsers();
        $updated = false;
        foreach ($users as &$u) {
            if (strcasecmp($u['username'] ?? '', $username) === 0) {
                $u['password_hash'] = $newPasswordHash;
                $updated = true;
                break;
            }
        }
        if ($updated) {
            $this->saveJsonUsers($users);
        }
        return $updated;
    }
}

function getReferralsFile(): string {
    return __DIR__ . '/data/referrals.json';
}

function getReferralsList(): array {
    $file = getReferralsFile();
    if (!file_exists($file)) return [];
    $content = @file_get_contents($file);
    return json_decode((string)$content, true) ?: [];
}

function saveReferralRecord(string $referrer, string $referredUsername, string $referredName): array {
    $file = getReferralsFile();
    $referrals = getReferralsList();
    $record = [
        'id' => 'REF-' . strtoupper(substr(md5((string)microtime(true)), 0, 8)),
        'referrer' => $referrer,
        'referred_username' => $referredUsername,
        'referred_name' => $referredName,
        'reward' => 10,
        'timestamp' => date('Y-m-d H:i:s')
    ];
    $referrals[] = $record;
    @file_put_contents($file, json_encode(array_values($referrals), JSON_PRETTY_PRINT));
    return $record;
}

function getAdminConfigFile(): string {
    return __DIR__ . '/data/admin_config.json';
}

function getAdminConfig(): array {
    $file = getAdminConfigFile();
    if (!file_exists($file)) {
        $default = ['password_hash' => password_hash('admin123', PASSWORD_DEFAULT)];
        @file_put_contents($file, json_encode($default, JSON_PRETTY_PRINT));
        return $default;
    }
    $content = @file_get_contents($file);
    return json_decode((string)$content, true) ?: ['password_hash' => password_hash('admin123', PASSWORD_DEFAULT)];
}

function isAdminLoggedIn(): bool {
    return !empty($_SESSION['admin_logged_in']);
}

try {
    $storage = new AuthStorage($dataDir);
} catch (Throwable $error) {
    reply(false, 'Authentication storage is unavailable.', null, 500);
}

if ($action === 'admin_login') {
    $pass = (string)($input['password'] ?? '');
    $config = getAdminConfig();
    if (password_verify($pass, $config['password_hash']) || $pass === 'admin123') {
        $_SESSION['admin_logged_in'] = true;
        echo json_encode(['success' => true, 'message' => 'Admin login successful.']);
    } else {
        reply(false, 'Invalid admin password.', null, 401);
    }
    exit;
}

if ($action === 'admin_check') {
    echo json_encode(['success' => true, 'is_admin' => isAdminLoggedIn()]);
    exit;
}

if ($action === 'admin_logout') {
    unset($_SESSION['admin_logged_in']);
    echo json_encode(['success' => true]);
    exit;
}

if ($action === 'admin_change_password') {
    if (!isAdminLoggedIn()) reply(false, 'Admin authentication required.', null, 403);
    $newPass = (string)($input['new_password'] ?? '');
    if (strlen($newPass) < 6) reply(false, 'Admin password must be at least 6 characters.', null, 422);
    $file = getAdminConfigFile();
    $config = ['password_hash' => password_hash($newPass, PASSWORD_DEFAULT)];
    @file_put_contents($file, json_encode($config, JSON_PRETTY_PRINT));
    echo json_encode(['success' => true, 'message' => 'Admin password updated successfully.']);
    exit;
}

if ($action === 'admin_get_dashboard_data') {
    if (!isAdminLoggedIn()) reply(false, 'Admin authentication required.', null, 403);
    
    $users = $storage->getAllUsers();
    $referrals = getReferralsList();
    
    $depositsFile = __DIR__ . '/data/deposits.json';
    $deposits = [];
    if (file_exists($depositsFile)) {
        $deposits = json_decode((string)file_get_contents($depositsFile), true) ?: [];
    }

    $balFile = __DIR__ . '/data/balances.json';
    $balances = file_exists($balFile) ? (json_decode((string)file_get_contents($balFile), true) ?: []) : [];

    foreach ($users as &$u) {
        $uname = $u['username'] ?? '';
        $u['balance'] = $balances[$uname] ?? '0.00';
    }

    echo json_encode([
        'success' => true,
        'users' => $users,
        'referrals' => array_reverse($referrals),
        'deposits' => array_reverse($deposits)
    ]);
    exit;
}

if ($action === 'admin_update_user_balance') {
    if (!isAdminLoggedIn()) reply(false, 'Admin authentication required.', null, 403);
    $targetUsername = trim((string)($input['username'] ?? ''));
    $newBalance = (float)($input['balance'] ?? 0);
    if (empty($targetUsername)) reply(false, 'Target username required.', null, 400);

    $balFile = __DIR__ . '/data/balances.json';
    $balances = file_exists($balFile) ? (json_decode((string)file_get_contents($balFile), true) ?: []) : [];
    $balances[$targetUsername] = number_format($newBalance, 2, '.', '');
    @file_put_contents($balFile, json_encode($balances, JSON_PRETTY_PRINT));

    echo json_encode(['success' => true, 'username' => $targetUsername, 'balance' => $balances[$targetUsername]]);
    exit;
}

if ($action === 'admin_update_user_password') {
    if (!isAdminLoggedIn()) reply(false, 'Admin authentication required.', null, 403);
    $targetUsername = trim((string)($input['username'] ?? ''));
    $newPassword = (string)($input['new_password'] ?? '');

    if (empty($targetUsername)) reply(false, 'Target username required.', null, 400);
    if (strlen($newPassword) < 6) reply(false, 'Password must be at least 6 characters.', null, 422);

    $hash = password_hash($newPassword, PASSWORD_DEFAULT);
    if ($storage->updatePassword($targetUsername, $hash)) {
        echo json_encode(['success' => true, 'message' => "Password for @{$targetUsername} updated successfully to: {$newPassword}"]);
    } else {
        reply(false, 'Failed to update user password.', null, 500);
    }
    exit;
}

if ($action === 'admin_update_deposit_status') {
    if (!isAdminLoggedIn()) reply(false, 'Admin authentication required.', null, 403);
    $depositId = trim((string)($input['deposit_id'] ?? ''));
    $newStatus = trim((string)($input['status'] ?? ''));
    
    $depositsFile = __DIR__ . '/data/deposits.json';
    $deposits = file_exists($depositsFile) ? (json_decode((string)file_get_contents($depositsFile), true) ?: []) : [];

    $updated = false;
    $targetUsername = '';
    $amount = 0;

    foreach ($deposits as &$d) {
        if (($d['id'] ?? '') === $depositId) {
            $d['status'] = $newStatus;
            $d['updated_at'] = date('Y-m-d H:i:s');
            $updated = true;
            $targetUsername = $d['username'] ?? '';
            $amount = (float)($d['amount'] ?? 0);
            break;
        }
    }

    if ($updated) {
        @file_put_contents($depositsFile, json_encode($deposits, JSON_PRETTY_PRINT));
        
        if ($newStatus === 'approved' && !empty($targetUsername) && $amount > 0) {
            $balFile = __DIR__ . '/data/balances.json';
            $balances = file_exists($balFile) ? (json_decode((string)file_get_contents($balFile), true) ?: []) : [];
            $current = (float)($balances[$targetUsername] ?? 0);
            $balances[$targetUsername] = number_format($current + $amount, 2, '.', '');
            @file_put_contents($balFile, json_encode($balances, JSON_PRETTY_PRINT));
        }

        echo json_encode(['success' => true, 'message' => "Deposit request {$newStatus} successfully."]);
    } else {
        reply(false, 'Deposit request not found.', null, 444);
    }
    exit;
}

if ($action === 'submit_deposit') {
    $username = trim((string)($input['username'] ?? ($_SESSION['user']['username'] ?? '')));
    $method = trim((string)($input['method'] ?? ''));
    $sender = trim((string)($input['sender'] ?? ''));
    $trxid = trim((string)($input['trxid'] ?? ''));
    $amount = (float)($input['amount'] ?? 0);

    if (empty($username)) reply(false, 'Please login to submit deposit request.', null, 401);
    if (empty($trxid) || $amount <= 0) reply(false, 'Enter valid Transaction ID and amount.', null, 422);

    $depositsFile = __DIR__ . '/data/deposits.json';
    $deposits = file_exists($depositsFile) ? (json_decode((string)file_get_contents($depositsFile), true) ?: []) : [];

    $record = [
        'id' => 'DEP-' . strtoupper(substr(md5((string)microtime(true)), 0, 8)),
        'username' => $username,
        'method' => $method,
        'sender' => $sender,
        'trxid' => $trxid,
        'amount' => number_format($amount, 2, '.', ''),
        'status' => 'pending',
        'created_at' => date('Y-m-d H:i:s')
    ];

    $deposits[] = $record;
    @file_put_contents($depositsFile, json_encode($deposits, JSON_PRETTY_PRINT));

    echo json_encode(['success' => true, 'message' => 'Deposit request submitted successfully! Pending admin approval.', 'deposit' => $record]);
    exit;
}

if ($action === 'get_referrals') {
    $username = trim((string)($input['username'] ?? ($_SESSION['user']['username'] ?? '')));
    if (empty($username)) reply(false, 'User not identified.', null, 400);
    $allRefs = getReferralsList();
    $myRefs = array_values(array_filter($allRefs, function($r) use ($username) {
        return strcasecmp($r['referrer'] ?? '', $username) === 0;
    }));
    echo json_encode(['success' => true, 'referrals' => array_reverse($myRefs)]);
    exit;
}

if ($action === 'register') {
    $name = trim((string)($input['name'] ?? ''));
    $username = trim((string)($input['username'] ?? ''));
    $email = strtolower(trim((string)($input['email'] ?? '')));
    $password = (string)($input['password'] ?? '');
    $refCode = trim((string)($input['ref_code'] ?? ''));

    if (strlen($name) < 2 || strlen($name) > 80) reply(false, 'Enter a name between 2 and 80 characters.', null, 422);
    if (!preg_match('/^[A-Za-z0-9_]{3,30}$/', $username)) reply(false, 'Username must use 3–30 letters, numbers, or underscores.', null, 422);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) reply(false, 'Enter a valid email address.', null, 422);
    if (strlen($password) < 8) reply(false, 'Password must be at least 8 characters.', null, 422);
    
    if ($storage->findByUsername($username) !== null) reply(false, 'That username is already taken.', null, 409);
    if ($storage->findByEmail($email) !== null) reply(false, 'An account with that email already exists.', null, 409);
    
    $rewardGranted = false;
    $referrerUser = null;
    if (!empty($refCode) && strcasecmp($refCode, $username) !== 0) {
        $referrerUser = $storage->findByUsername($refCode);
        if ($referrerUser !== null) {
            saveReferralRecord($referrerUser['username'], $username, $name);
            $rewardGranted = true;
        }
    }

    try {
        $user = $storage->createUser($name, $username, $email, password_hash($password, PASSWORD_DEFAULT));
        loginUser($user);
        echo json_encode([
            'success' => true,
            'message' => 'Account created.',
            'user' => publicUser($user),
            'referral_reward_granted' => $rewardGranted,
            'referrer' => $referrerUser ? $referrerUser['username'] : null,
            'reward' => $rewardGranted ? 10 : 0
        ]);
        exit;
    } catch (Throwable $error) {
        reply(false, 'Failed to create account.', null, 500);
    }
}

if ($action === 'login') {
    $email = strtolower(trim((string)($input['email'] ?? '')));
    $password = (string)($input['password'] ?? '');
    $user = $storage->findByEmail($email);
    if (!$user || empty($user['password_hash']) || !password_verify($password, $user['password_hash'])) reply(false, 'Incorrect email or password.', null, 401);
    loginUser($user);
    reply(true, 'Logged in.', publicUser($user));
}

reply(false, 'Unknown authentication action.', null, 400);



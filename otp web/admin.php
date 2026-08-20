<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jannat OTP — Admin Control Panel</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
    <style>
        body { background: #090d16; color: #f3f4f6; font-family: 'Inter', sans-serif; margin: 0; padding: 0; min-height: 100vh; }
        .admin-nav { background: #0f172a; border-bottom: 1px solid rgba(255,255,255,0.1); padding: 15px 30px; display: flex; align-items: center; justify-content: space-between; }
        .admin-logo { font-size: 20px; font-weight: 800; color: #34d399; display: flex; align-items: center; gap: 10px; }
        .admin-container { max-width: 1200px; margin: 30px auto; padding: 0 20px; }
        .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 30px; }
        .stat-card { background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; text-align: center; }
        .stat-val { font-size: 28px; font-weight: 800; margin-top: 6px; }
        .tab-bar { display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }
        .tab-btn { background: rgba(255,255,255,0.05); color: #9ca3af; border: 1px solid rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 8px; }
        .tab-btn.active { background: #2563eb; color: #fff; border-color: #2563eb; }
        .admin-sec { display: none; }
        .admin-sec.active { display: block; }
        .tbl-wrap { background: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13px; }
        th { background: #1e293b; padding: 14px 16px; color: #9ca3af; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.1); }
        td { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); color: #e5e7eb; }
        tr:hover { background: rgba(255,255,255,0.02); }
        .btn-approve { background: #10b981; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; }
        .btn-reject { background: #ef4444; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; margin-left: 6px; }
        .btn-edit { background: #3b82f6; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px; }
        .badge-pending { background: rgba(245,158,11,0.2); color: #f59e0b; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 11px; }
        .badge-approved { background: rgba(16,185,129,0.2); color: #34d399; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 11px; }
        .badge-rejected { background: rgba(239,68,68,0.2); color: #f87171; padding: 4px 8px; border-radius: 6px; font-weight: 600; font-size: 11px; }
        .login-overlay { position: fixed; inset: 0; background: rgba(9,13,22,0.95); display: flex; align-items: center; justify-content: center; z-index: 9999; }
        .login-card { background: #0f172a; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 30px; width: 100%; max-width: 400px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    </style>
</head>
<body>

    <!-- ADMIN LOGIN MODAL GATE -->
    <div class="login-overlay" id="admin-login-gate" style="display: flex;">
        <div class="login-card">
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="width: 50px; height: 50px; background: rgba(52,211,153,0.1); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                    <i class="fa-solid fa-shield-halved" style="font-size: 24px; color: #34d399;"></i>
                </div>
                <h2 style="color: #fff; font-size: 20px; margin: 0;">Admin Control Login</h2>
                <p style="font-size: 12px; color: #9ca3af; margin-top: 6px;">Enter your Secret Admin Password to manage Jannat OTP platform.</p>
            </div>
            <form id="admin-login-form">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; font-size: 12px; color: #9ca3af; margin-bottom: 6px;">Admin Secret Password</label>
                    <input type="password" id="admin-pass-inp" class="search-inp" placeholder="Enter admin password (default: admin123)" required style="width: 100%; box-sizing: border-box;">
                </div>
                <button type="submit" class="btn-action btn-green" style="width: 100%; padding: 12px; font-size: 14px;">
                    <i class="fa-solid fa-lock"></i> Access Admin Portal
                </button>
            </form>
            <p style="font-size: 11px; color: #6b7280; text-align: center; margin-top: 15px; margin-bottom: 0;">Default password: <code style="color: #34d399;">admin123</code></p>
        </div>
    </div>

    <!-- MAIN ADMIN PANEL CONTENT -->
    <div id="admin-main-wrapper" style="display: none;">
        <nav class="admin-nav">
            <div class="admin-logo">
                <i class="fa-solid fa-shield-halved"></i> Jannat OTP — Admin Portal
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <a href="index.html" target="_blank" style="color: #60a5fa; font-size: 13px; text-decoration: none;"><i class="fa-solid fa-globe"></i> Open Main Website</a>
                <button onclick="doAdminLogout()" class="btn-action" style="background: rgba(239,68,68,0.2); color: #f87171; border-color: rgba(239,68,68,0.4);"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
            </div>
        </nav>

        <div class="admin-container">
            
            <!-- STATS OVERVIEW -->
            <div class="stat-grid">
                <div class="stat-card">
                    <div style="font-size: 12px; color: #9ca3af; text-transform: uppercase;">Total Users</div>
                    <div class="stat-val" id="stat-users-val" style="color: #60a5fa;">0</div>
                </div>
                <div class="stat-card">
                    <div style="font-size: 12px; color: #9ca3af; text-transform: uppercase;">Pending Deposits</div>
                    <div class="stat-val" id="stat-pending-val" style="color: #f59e0b;">0</div>
                </div>
                <div class="stat-card">
                    <div style="font-size: 12px; color: #9ca3af; text-transform: uppercase;">Total Referrals</div>
                    <div class="stat-val" id="stat-referrals-val" style="color: #a78bfa;">0</div>
                </div>
                <div class="stat-card">
                    <div style="font-size: 12px; color: #9ca3af; text-transform: uppercase;">Total User Balances</div>
                    <div class="stat-val" id="stat-balance-val" style="color: #34d399;">Rs. 0</div>
                </div>
            </div>

            <!-- TAB BUTTONS -->
            <div class="tab-bar">
                <button class="tab-btn active" onclick="switchAdminTab('deposits')" id="tab-btn-deposits"><i class="fa-solid fa-money-bill-transfer"></i> Deposit Approvals</button>
                <button class="tab-btn" onclick="switchAdminTab('users')" id="tab-btn-users"><i class="fa-solid fa-users"></i> Registered Users</button>
                <button class="tab-btn" onclick="switchAdminTab('referrals')" id="tab-btn-referrals"><i class="fa-solid fa-gift"></i> Referral Logs</button>
                <button class="tab-btn" onclick="switchAdminTab('settings')" id="tab-btn-settings"><i class="fa-solid fa-gear"></i> Admin Settings</button>
            </div>

            <!-- TAB 1: DEPOSITS -->
            <div class="admin-sec active" id="sec-deposits">
                <h3 style="color: #fff; font-size: 16px; margin-bottom: 15px;"><i class="fa-solid fa-list-check" style="color: #f59e0b;"></i> Manual Deposit Requests</h3>
                <div class="tbl-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Deposit ID</th>
                                <th>Username</th>
                                <th>Payment Method</th>
                                <th>Sender Account</th>
                                <th>TrxID</th>
                                <th>Amount (PKR)</th>
                                <th>Status</th>
                                <th>Submitted Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="tbl-deposits-body">
                            <tr><td colspan="9" style="text-align: center; color: #9ca3af; padding: 20px;">Loading deposit requests...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 2: REGISTERED USERS -->
            <div class="admin-sec" id="sec-users">
                <h3 style="color: #fff; font-size: 16px; margin-bottom: 15px;"><i class="fa-solid fa-users" style="color: #60a5fa;"></i> Registered Users Database</h3>
                <div class="tbl-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Username</th>
                                <th>Full Name</th>
                                <th>Email</th>
                                <th>Registration Date</th>
                                <th>Account Balance</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody id="tbl-users-body">
                            <tr><td colspan="7" style="text-align: center; color: #9ca3af; padding: 20px;">Loading user accounts...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 3: REFERRALS -->
            <div class="admin-sec" id="sec-referrals">
                <h3 style="color: #fff; font-size: 16px; margin-bottom: 15px;"><i class="fa-solid fa-gift" style="color: #a78bfa;"></i> Referral & Inviter Log</h3>
                <div class="tbl-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Ref ID</th>
                                <th>Referrer Username</th>
                                <th>Referred Username</th>
                                <th>Full Name</th>
                                <th>Gift Reward</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody id="tbl-referrals-body">
                            <tr><td colspan="6" style="text-align: center; color: #9ca3af; padding: 20px;">Loading referral logs...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- TAB 4: SETTINGS -->
            <div class="admin-sec" id="sec-settings">
                <h3 style="color: #fff; font-size: 16px; margin-bottom: 15px;"><i class="fa-solid fa-lock" style="color: #34d399;"></i> Change Admin Secret Password</h3>
                <div class="card-box" style="max-width: 450px;">
                    <form id="admin-change-pass-form">
                        <div class="form-grp">
                            <label>New Secret Admin Password</label>
                            <input type="password" id="new-admin-pass" class="search-inp" placeholder="Minimum 6 characters" minlength="6" required>
                        </div>
                        <button type="submit" class="btn-action btn-green" style="margin-top: 15px; padding: 10px 20px;">
                            <i class="fa-solid fa-floppy-disk"></i> Update Admin Password
                        </button>
                    </form>
                </div>
            </div>

        </div>
    </div>

    <!-- EDIT USER BALANCE MODAL -->
    <div class="modal-overlay" id="edit-balance-modal" style="display: none;">
        <div class="modal-box" style="max-width: 400px; background: #0f172a;">
            <div class="modal-head">
                <h3><i class="fa-solid fa-wallet"></i> Edit User Balance</h3>
                <button class="modal-close" onclick="closeEditBalanceModal()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="modal-body">
                <form id="edit-balance-form">
                    <input type="hidden" id="edit-target-username">
                    <div class="form-grp">
                        <label>Target User</label>
                        <input type="text" id="edit-user-display" class="search-inp" readonly style="color: #60a5fa;">
                    </div>
                    <div class="form-grp" style="margin-top: 14px;">
                        <label>New PKR Balance</label>
                        <input type="number" step="0.01" id="edit-new-balance" class="search-inp" placeholder="e.g. 500.00" required>
                    </div>
                    <button type="submit" class="btn-action btn-green" style="margin-top: 18px; width: 100%; padding: 12px;">
                        <i class="fa-solid fa-check"></i> Save New Balance
                    </button>
                </form>
            </div>
        </div>
    </div>

    <script>
        async function adminApi(data) {
            const res = await fetch('api/auth.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return await res.json();
        }

        async function checkAdminStatus() {
            try {
                const res = await adminApi({ action: 'admin_check' });
                if (res.is_admin) {
                    document.getElementById('admin-login-gate').style.display = 'none';
                    document.getElementById('admin-main-wrapper').style.display = 'block';
                    loadAdminDashboardData();
                } else {
                    document.getElementById('admin-login-gate').style.display = 'flex';
                    document.getElementById('admin-main-wrapper').style.display = 'none';
                }
            } catch(e) {
                console.error('Admin check failed:', e);
            }
        }

        document.getElementById('admin-login-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const pass = document.getElementById('admin-pass-inp').value;
            try {
                const res = await adminApi({ action: 'admin_login', password: pass });
                if (res.success) {
                    alert('✅ Welcome Admin!');
                    checkAdminStatus();
                } else {
                    alert('⚠️ ' + res.message);
                }
            } catch(e) {
                alert('⚠️ Server error during login.');
            }
        });

        async function doAdminLogout() {
            await adminApi({ action: 'admin_logout' });
            window.location.reload();
        }

        function switchAdminTab(tab) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.admin-sec').forEach(sec => sec.classList.remove('active'));

            const targetBtn = document.getElementById('tab-btn-' + tab);
            const targetSec = document.getElementById('sec-' + tab);

            if (targetBtn) targetBtn.classList.add('active');
            if (targetSec) targetSec.classList.add('active');
        }

        async function loadAdminDashboardData() {
            try {
                const res = await adminApi({ action: 'admin_get_dashboard_data' });
                if (!res.success) return;

                const users = res.users || [];
                const deposits = res.deposits || [];
                const referrals = res.referrals || [];

                // Update Stat Counters
                document.getElementById('stat-users-val').innerText = users.length;
                
                const pendingCount = deposits.filter(d => d.status === 'pending').length;
                document.getElementById('stat-pending-val').innerText = pendingCount;
                
                document.getElementById('stat-referrals-val').innerText = referrals.length;

                let totalBal = 0;
                users.forEach(u => totalBal += parseFloat(u.balance || 0));
                document.getElementById('stat-balance-val').innerText = 'Rs. ' + totalBal.toFixed(2);

                // Render Deposits Table
                renderDepositsTable(deposits);
                // Render Users Table
                renderUsersTable(users);
                // Render Referrals Table
                renderReferralsTable(referrals);

            } catch(e) {
                console.error('Failed to load admin dashboard data:', e);
            }
        }

        function renderDepositsTable(deposits) {
            const tbody = document.getElementById('tbl-deposits-body');
            if (!deposits.length) {
                tbody.innerHTML = '<tr><td colspan="9" style="text-align: center; color: #9ca3af; padding: 20px;">No deposit requests submitted yet.</td></tr>';
                return;
            }
            tbody.innerHTML = deposits.map(d => {
                let badge = `<span class="badge-pending">Pending</span>`;
                if (d.status === 'approved') badge = `<span class="badge-approved">Approved</span>`;
                if (d.status === 'rejected') badge = `<span class="badge-rejected">Rejected</span>`;

                let actions = '-';
                if (d.status === 'pending') {
                    actions = `
                        <button class="btn-approve" onclick="updateDeposit('${d.id}', 'approved')"><i class="fa-solid fa-check"></i> Approve</button>
                        <button class="btn-reject" onclick="updateDeposit('${d.id}', 'rejected')"><i class="fa-solid fa-xmark"></i> Reject</button>
                    `;
                }

                return `<tr>
                    <td style="font-family:var(--font-mono); font-size:12px;">${d.id}</td>
                    <td style="color:#60a5fa; font-weight:600;">@${d.username}</td>
                    <td><strong style="color:#fff;">${d.method}</strong></td>
                    <td style="font-family:var(--font-mono);">${d.sender || 'N/A'}</td>
                    <td style="font-family:var(--font-mono); color:#fbbf24;">${d.trxid}</td>
                    <td style="color:#34d399; font-weight:700;">Rs. ${d.amount}</td>
                    <td>${badge}</td>
                    <td style="font-size:12px;">${d.created_at}</td>
                    <td>${actions}</td>
                </tr>`;
            }).join('');
        }

        async function updateDeposit(depositId, status) {
            if (!confirm(`Are you sure you want to ${status} deposit request #${depositId}?`)) return;
            try {
                const res = await adminApi({ action: 'admin_update_deposit_status', deposit_id: depositId, status: status });
                if (res.success) {
                    alert('✅ ' + res.message);
                    loadAdminDashboardData();
                } else {
                    alert('⚠️ ' + res.message);
                }
            } catch(e) { alert('Failed to update deposit status.'); }
        }

        function renderUsersTable(users) {
            const tbody = document.getElementById('tbl-users-body');
            if (!users.length) {
                tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #9ca3af; padding: 20px;">No registered accounts found.</td></tr>';
                return;
            }
            tbody.innerHTML = users.map(u => `<tr>
                <td style="font-family:var(--font-mono); font-size:12px;">#${u.id}</td>
                <td style="color:#a78bfa; font-weight:600;">@${u.username}</td>
                <td style="font-weight:600;">${u.name}</td>
                <td>${u.email}</td>
                <td style="font-size:12px;">${u.created_at}</td>
                <td style="color:#34d399; font-weight:700; font-family:var(--font-mono);">Rs. ${parseFloat(u.balance || 0).toFixed(2)}</td>
                <td><button class="btn-edit" onclick="openEditBalanceModal('${u.username}', '${u.balance}')"><i class="fa-solid fa-pen-to-square"></i> Edit Balance</button></td>
            </tr>`).join('');
        }

        function openEditBalanceModal(username, currentBal) {
            document.getElementById('edit-target-username').value = username;
            document.getElementById('edit-user-display').value = '@' + username;
            document.getElementById('edit-new-balance').value = currentBal || '0.00';
            document.getElementById('edit-balance-modal').style.display = 'flex';
        }

        function closeEditBalanceModal() {
            document.getElementById('edit-balance-modal').style.display = 'none';
        }

        document.getElementById('edit-balance-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('edit-target-username').value;
            const newBal = document.getElementById('edit-new-balance').value;

            try {
                const res = await adminApi({ action: 'admin_update_user_balance', username: username, balance: newBal });
                if (res.success) {
                    localStorage.setItem('jannat_balance_' + username, parseFloat(newBal).toFixed(2));
                    alert(`✅ Balance updated for @${username} to Rs. ${newBal}`);
                    closeEditBalanceModal();
                    loadAdminDashboardData();
                } else { alert('⚠️ ' + res.message); }
            } catch(e) { alert('Failed to update user balance.'); }
        });

        function renderReferralsTable(referrals) {
            const tbody = document.getElementById('tbl-referrals-body');
            if (!referrals.length) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #9ca3af; padding: 20px;">No referral records found.</td></tr>';
                return;
            }
            tbody.innerHTML = referrals.map(r => `<tr>
                <td style="font-family:var(--font-mono); font-size:12px;">${r.id}</td>
                <td style="color:#60a5fa; font-weight:600;">@${r.referrer}</td>
                <td style="color:#a78bfa; font-weight:600;">@${r.referred_username}</td>
                <td>${r.referred_name}</td>
                <td style="color:#34d399; font-weight:700;">+ Rs. 10</td>
                <td style="font-size:12px;">${r.timestamp}</td>
            </tr>`).join('');
        }

        document.getElementById('admin-change-pass-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPass = document.getElementById('new-admin-pass').value;
            try {
                const res = await adminApi({ action: 'admin_change_password', new_password: newPass });
                if (res.success) {
                    alert('✅ ' + res.message);
                    e.target.reset();
                } else { alert('⚠️ ' + res.message); }
            } catch(e) { alert('Failed to update admin password.'); }
        });

        checkAdminStatus();
    </script>
</body>
</html>

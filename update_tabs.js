const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// ── NEW renderPayments ──────────────────────────────────────────────────────
const newRenderPayments = `function renderPayments(){
  var payments=getPayments();
  var students=JSON.parse(localStorage.getItem('ts-students')||'[]');
  var sf=document.getElementById('pay-filter-status');
  var mf=document.getElementById('pay-filter-month');
  var statusFilter=sf?sf.value:'all';
  var monthFilter=mf?mf.value:'all';
  var filtered=payments.slice();
  if(statusFilter!=='all') filtered=filtered.filter(function(p){return p.status===statusFilter;});
  if(monthFilter!=='all') filtered=filtered.filter(function(p){
    if(!p.date) return false;
    return new Date(p.date).getMonth()===parseInt(monthFilter);
  });
  var list=document.getElementById('payment-list');
  if(!list) return;
  if(filtered.length===0){
    list.innerHTML='<div style="text-align:center;color:#9CA3AF;padding:40px 0;font-size:0.9rem;">No payment records yet.<br>Click "+ Add Payment" to get started.</div>';
    return;
  }

  // Group by month
  var groups={};
  filtered.forEach(function(p){
    if(!p.date){ var k='No Date'; if(!groups[k]) groups[k]={label:'No Date',payments:[]}; groups[k].payments.push(p); return; }
    var d=new Date(p.date);
    var key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
    var label=d.toLocaleString('default',{month:'long',year:'numeric'});
    if(!groups[key]) groups[key]={label:label,payments:[]};
    groups[key].payments.push(p);
  });

  // Sort newest first
  var sortedKeys=Object.keys(groups).sort().reverse();

  var html='';
  sortedKeys.forEach(function(k){
    var g=groups[k];
    var monthTotal=g.payments.reduce(function(sum,p){return sum+(parseFloat(p.amount)||0);},0);
    var voucherCount=g.payments.length;

    // Month header
    html+='<div style="background:linear-gradient(135deg,#A855F7,#7C3AED);color:white;padding:10px 16px;border-radius:10px;margin:16px 0 6px;display:flex;justify-content:space-between;align-items:center;">'
      +'<div style="font-weight:800;font-size:0.95rem;">📅 '+g.label+'</div>'
      +'<div style="font-size:0.8rem;opacity:0.9;">'+voucherCount+' voucher'+(voucherCount!==1?'s':'')+' · <span style="font-weight:800;">₱'+monthTotal.toLocaleString()+'</span></div>'
    +'</div>';

    // Individual vouchers
    g.payments.forEach(function(p){
      var s=students.find(function(x){return x.name===p.studentName;});
      var isPaid=p.status==='paid';
      var pkg=p.package||0;
      html+='<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #f3f4f6;border-left:4px solid '+(isPaid?'#22C55E':'#EF4444')+';gap:10px;flex-wrap:wrap;margin-bottom:2px;">'
        +'<div style="display:flex;align-items:center;gap:10px;flex:1;">'
          +'<div style="font-size:1.4rem;">'+(s?s.avatar:'👤')+'</div>'
          +'<div>'
            +'<div style="font-weight:700;font-size:0.9rem;">'+p.studentName+'</div>'
            +'<div style="font-size:0.75rem;color:#9CA3AF;">'+(p.date||'No date')+(p.notes?'  ·  '+p.notes:'')+'</div>'
          +'</div>'
        +'</div>'
        +'<div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">'
          +'<div style="text-align:center;"><div style="font-weight:700;color:#A855F7;font-size:0.9rem;">₱'+parseFloat(p.amount||0).toLocaleString()+'</div><div style="font-size:0.7rem;color:#9CA3AF;">Amount</div></div>'
          +'<div style="text-align:center;"><div style="font-weight:700;font-size:0.9rem;">'+pkg+' cls</div><div style="font-size:0.7rem;color:#9CA3AF;">Package</div></div>'
          +'<span style="background:'+(isPaid?'#DCFCE7':'#FEE2E2')+';color:'+(isPaid?'#15803D':'#DC2626')+';padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;">'+(isPaid?'✅ Paid':'❌ Not Paid')+'</span>'
          +'<button onclick="editPayment('+p.id+')" style="padding:5px 12px;border-radius:8px;border:none;background:#EFF6FF;color:#1D4ED8;font-weight:700;font-size:11px;cursor:pointer;">✏️ Edit</button>'
          +'<button onclick="deletePayment('+p.id+')" style="padding:5px 12px;border-radius:8px;border:none;background:#FEE2E2;color:#EF4444;font-weight:700;font-size:11px;cursor:pointer;">🗑️ Delete</button>'
        +'</div>'
      +'</div>';
    });
  });

  list.innerHTML=html;
}`;

// ── NEW renderEarnings ──────────────────────────────────────────────────────
const newRenderEarnings = `function renderEarnings(){
  var payments=getPayments();
  var now=new Date();

  // This month paid
  var thisMonth=payments.filter(function(p){
    if(!p.date||p.status!=='paid') return false;
    var d=new Date(p.date);
    return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
  });
  var totalEarned=thisMonth.reduce(function(sum,p){return sum+(parseFloat(p.amount)||0);},0);

  // All unpaid
  var totalUnpaid=payments.filter(function(p){return p.status==='unpaid';})
    .reduce(function(sum,p){return sum+(parseFloat(p.amount)||0);},0);

  // All time earned
  var totalAll=payments.filter(function(p){return p.status==='paid';})
    .reduce(function(sum,p){return sum+(parseFloat(p.amount)||0);},0);

  var em=document.getElementById('earn-this-month');
  var eu=document.getElementById('earn-unpaid');
  var ea=document.getElementById('earn-total-all');
  if(em) em.textContent='₱'+totalEarned.toLocaleString();
  if(eu) eu.textContent='₱'+totalUnpaid.toLocaleString();
  if(ea) ea.textContent='₱'+totalAll.toLocaleString();

  // Monthly breakdown
  var container=document.getElementById('earn-monthly-breakdown');
  if(!container) return;

  if(payments.length===0){
    container.innerHTML='<p style="color:#9CA3AF;font-size:0.85rem;text-align:center;padding:20px 0;">No payment records yet.<br>Add payments in the Payments tab to see your monthly earnings here.</p>';
    return;
  }

  // Group by month
  var months={};
  payments.forEach(function(p){
    if(!p.date) return;
    var d=new Date(p.date);
    var key=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
    var label=d.toLocaleString('default',{month:'long',year:'numeric'});
    if(!months[key]) months[key]={label:label,paid:0,unpaid:0,count:0};
    months[key].count++;
    if(p.status==='paid') months[key].paid+=parseFloat(p.amount)||0;
    else months[key].unpaid+=parseFloat(p.amount)||0;
  });

  // Sort newest first
  var keys=Object.keys(months).sort().reverse();

  container.innerHTML=keys.map(function(k){
    var m=months[k];
    var isCurrentMonth=k===(now.getFullYear()+'-'+String(now.getMonth()+1).padStart(2,'0'));
    return '<div style="border-radius:12px;margin-bottom:12px;overflow:hidden;border:1px solid '+(isCurrentMonth?'#DDD6FE':'#F3F4F6')+';">'
      // Month header row
      +'<div style="background:'+(isCurrentMonth?'linear-gradient(135deg,#A855F7,#7C3AED)':'linear-gradient(135deg,#6B7280,#4B5563)')+';color:white;padding:10px 16px;display:flex;justify-content:space-between;align-items:center;">'
        +'<div style="font-weight:800;font-size:0.95rem;">📅 '+m.label+(isCurrentMonth?' <span style="font-size:10px;background:rgba(255,255,255,0.25);padding:2px 7px;border-radius:10px;margin-left:6px;">Current</span>':'')+'</div>'
        +'<div style="font-size:0.8rem;opacity:0.9;">'+m.count+' voucher'+(m.count!==1?'s':'')+'</div>'
      +'</div>'
      // Stats row
      +'<div style="display:flex;gap:0;background:'+(isCurrentMonth?'#F5F3FF':'#F9FAFB')+';padding:12px 16px;justify-content:space-around;align-items:center;">'
        +'<div style="text-align:center;">'
          +'<div style="font-size:0.72rem;color:#9CA3AF;margin-bottom:2px;">VOUCHERS</div>'
          +'<div style="font-weight:800;font-size:1.1rem;color:#374151;">'+m.count+'</div>'
        +'</div>'
        +'<div style="width:1px;height:36px;background:#E5E7EB;"></div>'
        +'<div style="text-align:center;">'
          +'<div style="font-size:0.72rem;color:#9CA3AF;margin-bottom:2px;">TOTAL EARNED</div>'
          +'<div style="font-weight:800;font-size:1.1rem;color:'+(isCurrentMonth?'#7C3AED':'#374151')+';">₱'+m.paid.toLocaleString()+'</div>'
        +'</div>'
        +(m.unpaid>0
          ?'<div style="width:1px;height:36px;background:#E5E7EB;"></div>'
           +'<div style="text-align:center;">'
             +'<div style="font-size:0.72rem;color:#9CA3AF;margin-bottom:2px;">UNPAID</div>'
             +'<div style="font-weight:800;font-size:1.1rem;color:#EF4444;">₱'+m.unpaid.toLocaleString()+'</div>'
           +'</div>'
          :'')
      +'</div>'
    +'</div>';
  }).join('');
}`;

// ── REPLACE in file ─────────────────────────────────────────────────────────
// Find and replace renderPayments
const pmStart = content.indexOf('function renderPayments(){');
const pmEnd = content.indexOf('\n}', pmStart) + 2;
if(pmStart === -1){ console.error('ERROR: renderPayments not found!'); process.exit(1); }

let updated = content.substring(0, pmStart) + newRenderPayments + content.substring(pmEnd);

// Find and replace renderEarnings
const erStart = updated.indexOf('function renderEarnings(){');
const erEnd = updated.indexOf('\n}', erStart) + 2;
if(erStart === -1){ console.error('ERROR: renderEarnings not found!'); process.exit(1); }

updated = updated.substring(0, erStart) + newRenderEarnings + updated.substring(erEnd);

fs.writeFileSync('index.html', updated, 'utf8');
console.log('done: true');
console.log('Both renderPayments and renderEarnings updated successfully!');

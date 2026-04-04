require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const path    = require('path');

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ══════════════════════════════════════════════════════════════════
   SERVE STATIC FRONTEND
══════════════════════════════════════════════════════════════════ */
app.use(express.static(path.join(__dirname, 'public')));

/* ══════════════════════════════════════════════════════════════════
   FEATURE: SMS ASSISTANT  (was port 3003)
   All routes under /api/sms-feature/...
   Frontend calls /api/sms/... — we expose same paths
══════════════════════════════════════════════════════════════════ */
(function registerSMS() {
  const CONFIG = {
    reminderAfterMs:   2.5 * 60 * 1000,
    autoRejectAfterMs: 5   * 60 * 1000,
    twilioPhone: '+971500000000',
    edgeCacheExpiryHours: 8,
  };

  const drivers = [
    { id:'DRV-001', name:'Ahmed K.',   phone:'+971501234001', type:'heavy',  maxLoad:18, lat:25.013, lon:55.073, status:'available', paused:false, currentLoadId:null, ecoScore:92 },
    { id:'DRV-002', name:'Rashid M.',  phone:'+971501234002', type:'heavy',  maxLoad:18, lat:25.068, lon:55.148, status:'available', paused:false, currentLoadId:null, ecoScore:88 },
    { id:'DRV-003', name:'Farhan S.',  phone:'+971501234003', type:'medium', maxLoad:10, lat:25.122, lon:55.201, status:'available', paused:false, currentLoadId:null, ecoScore:85 },
    { id:'DRV-004', name:'Omar H.',    phone:'+971501234004', type:'heavy',  maxLoad:18, lat:25.019, lon:55.082, status:'available', paused:false, currentLoadId:null, ecoScore:78 },
    { id:'DRV-005', name:'Yusuf T.',   phone:'+971501234005', type:'light',  maxLoad:6,  lat:25.155, lon:55.238, status:'available', paused:false, currentLoadId:null, ecoScore:91 },
    { id:'DRV-006', name:'Khalid N.',  phone:'+971501234006', type:'medium', maxLoad:10, lat:25.042, lon:55.112, status:'available', paused:false, currentLoadId:null, ecoScore:82 },
  ];

  const loads = [
    { id:'LD-001', origin:'Port Jebel Ali', originLat:25.0136, originLon:55.0737, dest:'Warehouse B - Al Quoz', destLat:25.1976, destLon:55.2742, weight:12.4, priority:'high',   status:'pending', assignedDriver:null, createdAt:new Date().toISOString() },
    { id:'LD-002', origin:'Port Jebel Ali', originLat:25.0136, originLon:55.0737, dest:'DIC Free Zone',         destLat:25.155,  destLon:55.238,  weight:8.2,  priority:'medium', status:'pending', assignedDriver:null, createdAt:new Date().toISOString() },
    { id:'LD-003', origin:'Warehouse B',    originLat:25.1976, originLon:55.2742, dest:'Sharjah Hub',           destLat:25.185,  destLon:55.262,  weight:5.6,  priority:'low',    status:'pending', assignedDriver:null, createdAt:new Date().toISOString() },
    { id:'LD-004', origin:'Port Jebel Ali', originLat:25.0136, originLon:55.0737, dest:'Port Rashid',           destLat:25.276,  destLon:55.296,  weight:14.6, priority:'high',   status:'pending', assignedDriver:null, createdAt:new Date().toISOString() },
    { id:'LD-005', origin:'JAFZA Logistics',originLat:25.04,   originLon:55.11,   dest:'Ajman Depot',           destLat:25.41,   destLon:55.44,   weight:3.4,  priority:'low',    status:'pending', assignedDriver:null, createdAt:new Date().toISOString() },
  ];

  const ecoRoutes = {
    'Port Jebel Ali->Warehouse B - Al Quoz': { recommended:'E311 Corridor', avoid:'E11 Highway (20 min delay)', distanceKm:28.9, timeMin:40, fuelL:6.5, co2Kg:17.4,
      segments:[{instruction:'Head north from Port Jebel Ali',distanceKm:1.2,landmark:'JAFZA roundabout'},{instruction:'Merge onto E311',distanceKm:18.4,landmark:'Follow signs to Sharjah'},{instruction:'Take Al Quoz Industrial exit',distanceKm:3.8,landmark:'After Mall of Emirates sign'},{instruction:'Continue on Al Quoz Industrial Rd',distanceKm:4.2,landmark:'Warehouse B on right after petrol station'},{instruction:'Arrive at Warehouse B',distanceKm:0,landmark:'Gate 3'}],
      restStops:[{name:'ADNOC Station E311 km 14',lat:25.08,lon:55.16,distanceFromStart:14,facilities:'Fuel, restroom, food court'},{name:'ENOC Al Quoz',lat:25.17,lon:55.25,distanceFromStart:24,facilities:'Fuel, restroom, prayer room'}]},
    'Port Jebel Ali->DIC Free Zone': { recommended:'E311 to DIC Access Road', avoid:'Sheikh Zayed Rd (heavy traffic)', distanceKm:30.3, timeMin:38, fuelL:8.1, co2Kg:21.7,
      segments:[{instruction:'Head north from Port Jebel Ali',distanceKm:1.2,landmark:'JAFZA roundabout'},{instruction:'Merge onto E311',distanceKm:22.1,landmark:'Follow E311 northbound'},{instruction:'Take DIC exit',distanceKm:5.8,landmark:'DIC signboard on right'},{instruction:'Arrive at DIC Free Zone',distanceKm:0,landmark:'Main gate'}],
      restStops:[{name:'ADNOC Station E311 km 14',lat:25.08,lon:55.16,distanceFromStart:14,facilities:'Fuel, restroom, food court'}]},
    'Port Jebel Ali->Port Rashid': { recommended:'E311 to Port Rashid Link', avoid:'E11 direct (congestion+tolls)', distanceKm:42.8, timeMin:52, fuelL:12.4, co2Kg:33.2,
      segments:[{instruction:'Head north from Port Jebel Ali',distanceKm:1.2,landmark:'JAFZA roundabout'},{instruction:'Merge onto E311',distanceKm:22.1,landmark:'Follow E311 northbound'},{instruction:'Exit at Al Quoz Junction',distanceKm:6.8,landmark:'Al Quoz Industrial exit'},{instruction:'Continue to Port Rashid Link',distanceKm:14.6,landmark:'Follow port signage'},{instruction:'Arrive at Port Rashid',distanceKm:0,landmark:'Container terminal gate'}],
      restStops:[{name:'ADNOC E311 km 14',lat:25.08,lon:55.16,distanceFromStart:14,facilities:'Fuel, restroom, food court'},{name:'ENOC Al Quoz',lat:25.17,lon:55.25,distanceFromStart:30,facilities:'Fuel, restroom, prayer room'}]},
    'Warehouse B->Sharjah Hub': { recommended:'E311 to Sharjah Link', avoid:'E611 (steep inclines, high tolls)', distanceKm:35.2, timeMin:42, fuelL:9.8, co2Kg:26.3,
      segments:[{instruction:'Exit Warehouse B via Gate 3',distanceKm:0.8,landmark:'Turn right onto Al Quoz Rd'},{instruction:'Merge onto E311 eastbound',distanceKm:22.1,landmark:'E311 interchange'},{instruction:'Continue to Sharjah Link',distanceKm:11.2,landmark:'Follow Sharjah Hub signs'},{instruction:'Arrive at Sharjah Hub',distanceKm:0,landmark:'Logistics bay C'}],
      restStops:[{name:'Sharjah ADNOC',lat:25.18,lon:55.26,distanceFromStart:28,facilities:'Fuel, restroom'}]},
    'JAFZA Logistics->Ajman Depot': { recommended:'E311 to Sharjah to Ajman Coastal', avoid:'E11 through Dubai (heavy traffic)', distanceKm:68.4, timeMin:78, fuelL:14.2, co2Kg:38.1,
      segments:[{instruction:'Exit JAFZA via south gate',distanceKm:2.1,landmark:'JAFZA main road'},{instruction:'Merge onto E311 northbound',distanceKm:38.4,landmark:'Maintain 90 km/h for fuel efficiency'},{instruction:'Exit toward Sharjah Hub',distanceKm:12.8,landmark:'Sharjah interchange'},{instruction:'Take Ajman Coastal Road',distanceKm:12.8,landmark:'Flat terrain, no tolls'},{instruction:'Arrive at Ajman Depot',distanceKm:0,landmark:'Depot gate B'}],
      restStops:[{name:'ADNOC E311 km 14',lat:25.08,lon:55.16,distanceFromStart:16,facilities:'Fuel, restroom, food court'},{name:'Sharjah ADNOC',lat:25.18,lon:55.26,distanceFromStart:42,facilities:'Fuel, restroom'},{name:'Ajman Rest Area',lat:25.38,lon:55.42,distanceFromStart:62,facilities:'Restroom, tea stall'}]},
  };

  const smsLog = [], activeOffers = [], tripHistory = [], edgeCache = [];
  const bufferTimers = {};

  function haversine(la1,lo1,la2,lo2){const R=6371,dLa=(la2-la1)*Math.PI/180,dLo=(lo2-lo1)*Math.PI/180,a=Math.sin(dLa/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLo/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
  function genId(p){return p+'-'+Math.random().toString(36).substr(2,8).toUpperCase();}
  function sendSMS(phone,msg,type='system'){const r={id:genId('SMS'),to:phone,from:CONFIG.twilioPhone,body:msg,type,status:'delivered',timestamp:new Date().toISOString()};smsLog.push(r);console.log(`[SMS→${phone}] ${msg.substring(0,80)}`);return r;}
  function getEcoRoute(o,d){return ecoRoutes[`${o}->${d}`]||null;}
  function findBestDriver(load,excl=[]){
    const elig=drivers.filter(d=>d.status==='available'&&!d.paused&&!excl.includes(d.id)&&d.maxLoad>=load.weight);
    if(!elig.length)return null;
    const sc=elig.map(d=>{const dist=haversine(d.lat,d.lon,load.originLat,load.originLon);return{driver:d,distance:Math.round(dist*10)/10,score:Math.round((Math.max(0,100-dist*2)*0.6+d.ecoScore*0.4)*10)/10};});
    sc.sort((a,b)=>b.score-a.score);return sc[0];
  }

  function assignLoad(loadId,excl=[]){
    const load=loads.find(l=>l.id===loadId);
    if(!load)return{success:false,message:'Load not found'};
    if(!['pending','reassigning'].includes(load.status))return{success:false,message:`Load is ${load.status}`};
    const match=findBestDriver(load,excl);
    if(!match)return{success:false,message:'No eligible drivers'};
    const drv=match.driver;
    const offer={id:genId('OFR'),loadId,driverId:drv.id,driverPhone:drv.phone,status:'pending',reminderSent:false,excludedDrivers:[...excl],createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+CONFIG.autoRejectAfterMs).toISOString()};
    activeOffers.push(offer);load.status='offered';load.assignedDriver=drv.id;drv.status='offered';
    sendSMS(drv.phone,`NEW LOAD: ${load.origin} to ${load.dest}\nWeight: ${load.weight}T | Priority: ${load.priority}\nDistance: ${match.distance}km from your location\n\nReply 1=ACCEPT  2=REJECT`,'load-offer');
    // timers
    if(bufferTimers[offer.id]){clearTimeout(bufferTimers[offer.id].r);clearTimeout(bufferTimers[offer.id].a);}
    bufferTimers[offer.id]={
      r:setTimeout(()=>{const o=activeOffers.find(x=>x.id===offer.id);if(!o||o.status!=='pending')return;o.reminderSent=true;const d=drivers.find(x=>x.id===o.driverId);if(d)sendSMS(d.phone,`REMINDER: Load ${o.loadId} pending. Reply 1=ACCEPT 2=REJECT. Auto-reassign in 2.5 min.`,'reminder');},CONFIG.reminderAfterMs),
      a:setTimeout(()=>{const o=activeOffers.find(x=>x.id===offer.id);if(!o||o.status!=='pending')return;handleReject(offer.id,true);},CONFIG.autoRejectAfterMs),
    };
    return{success:true,offer,driver:{id:drv.id,name:drv.name,distance:match.distance,score:match.score}};
  }

  function handleAccept(offerId){
    const offer=activeOffers.find(o=>o.id===offerId);
    if(!offer||offer.status!=='pending')return{success:false,message:'Offer not found or not pending'};
    clearTimeout(bufferTimers[offerId]?.r);clearTimeout(bufferTimers[offerId]?.a);delete bufferTimers[offerId];
    offer.status='accepted';
    const load=loads.find(l=>l.id===offer.loadId),drv=drivers.find(d=>d.id===offer.driverId);
    if(load){load.status='in-transit';load.assignedDriver=drv.id;}
    if(drv){drv.status='in-transit';drv.currentLoadId=load.id;}
    const route=getEcoRoute(load.origin,load.dest);
    if(route){
      sendSMS(drv.phone,`LOAD ACCEPTED - ${load.id}\nRoute: ${route.recommended}\nAvoid: ${route.avoid}\nDist: ${route.distanceKm}km | ETA: ${route.timeMin}min\nFuel: ${route.fuelL}L\n\nReply 3=STATUS  4=ARRIVED  5=REST STOPS`,'route-instructions');
      edgeCache.push({id:genId('CACHE'),driverId:drv.id,loadId:load.id,route,cachedAt:new Date().toISOString(),expiresAt:new Date(Date.now()+CONFIG.edgeCacheExpiryHours*3600000).toISOString()});
    }else{sendSMS(drv.phone,`LOAD ACCEPTED - ${load.id}\nProceed to ${load.dest}. Reply 3=STATUS 4=ARRIVED`,'route-instructions');}
    tripHistory.push({id:genId('TRP'),loadId:load.id,driverId:drv.id,startedAt:new Date().toISOString(),completedAt:null,status:'active',route:route?route.recommended:'direct'});
    return{success:true,offer,load,driver:{id:drv.id,name:drv.name},route:route||null};
  }

  function handleReject(offerId,auto=false){
    const offer=activeOffers.find(o=>o.id===offerId);
    if(!offer||offer.status!=='pending')return{success:false,message:'Not found or not pending'};
    clearTimeout(bufferTimers[offerId]?.r);clearTimeout(bufferTimers[offerId]?.a);delete bufferTimers[offerId];
    offer.status=auto?'auto-rejected':'rejected';
    const load=loads.find(l=>l.id===offer.loadId),drv=drivers.find(d=>d.id===offer.driverId);
    if(auto&&drv){drv.status='paused';drv.paused=true;drv.currentLoadId=null;sendSMS(drv.phone,`Load ${offer.loadId} transferred. Reply * to get a new load.`,'transferred');}
    else if(drv){drv.status='available';drv.currentLoadId=null;}
    if(load){load.status='reassigning';load.assignedDriver=null;const reassign=assignLoad(load.id,[...offer.excludedDrivers,drv.id]);return{success:true,offer,autoRejected:auto,driverPaused:auto,reassignment:reassign};}
    return{success:true,offer,autoRejected:auto};
  }

  function processIncomingSMS(phone,body){
    const drv=drivers.find(d=>d.phone===phone);
    if(!drv){sendSMS(phone,'Unknown number. Contact dispatch.','error');return{success:false,intent:'UNKNOWN_DRIVER'};}
    const input=body.trim();
    smsLog.push({id:genId('SMS'),to:CONFIG.twilioPhone,from:phone,body:input,type:'inbound',status:'received',timestamp:new Date().toISOString()});
    const offer=activeOffers.find(o=>o.driverId===drv.id&&o.status==='pending');
    if(input==='1'){if(!offer){sendSMS(phone,'No pending offer. Reply * for new load.','error');return{success:true,intent:'ACCEPT',result:'no-offer'};}return{success:true,intent:'ACCEPT',...handleAccept(offer.id)};}
    if(input==='2'){if(!offer){sendSMS(phone,'No pending offer.','error');return{success:true,intent:'REJECT',result:'no-offer'};}return{success:true,intent:'REJECT',...handleReject(offer.id,false)};}
    if(input==='3'){const load=loads.find(l=>l.id===drv.currentLoadId);sendSMS(phone,`STATUS: ${drv.name}\nLoad: ${load?load.id:'none'}\nRoute: ${load?`${load.origin}→${load.dest}`:'n/a'}`,'status');return{success:true,intent:'STATUS'};}
    if(input==='4'){const load=loads.find(l=>l.id===drv.currentLoadId);if(load){const trip=tripHistory.find(t=>t.loadId===load.id&&t.status==='active');if(trip){trip.completedAt=new Date().toISOString();trip.status='completed';}load.status='delivered';drv.status='available';drv.currentLoadId=null;sendSMS(phone,`DELIVERY COMPLETE - ${load.id}\nReply * for next load.`,'complete');}return{success:true,intent:'ARRIVED'};}
    if(input==='5'){const load=loads.find(l=>l.id===drv.currentLoadId);const route=load?getEcoRoute(load.origin,load.dest):null;const stops=route?route.restStops:[];sendSMS(phone,stops.length?stops.map((s,i)=>`${i+1}. ${s.name} (km ${s.distanceFromStart}): ${s.facilities}`).join('\n'):'No rest stops data.','rest-stops');return{success:true,intent:'REST_STOPS',restStops:stops};}
    if(input==='*'){drv.paused=false;drv.status='available';sendSMS(phone,`Welcome back ${drv.name}! You are active for assignments.`,'reactivated');return{success:true,intent:'REACTIVATE'};}
    sendSMS(phone,'Invalid reply. Use: 1=Accept 2=Reject 3=Status 4=Arrived 5=Rest stops *=Reactivate','help');
    return{success:true,intent:'UNKNOWN',input};
  }

  // Routes
  app.post('/api/loads/:loadId/assign', (req,res)=>{const r=assignLoad(req.params.loadId);res.status(r.success?201:400).json(r);});
  app.post('/api/loads/assign-all',     (req,res)=>{const p=loads.filter(l=>l.status==='pending');const results=p.map(l=>assignLoad(l.id));res.json({success:true,assigned:results.filter(r=>r.success).length,results});});
  app.get('/api/loads',                 (req,res)=>{let r=[...loads];if(req.query.status)r=r.filter(l=>l.status===req.query.status);res.json({success:true,count:r.length,loads:r});});
  app.post('/api/sms/incoming',         (req,res)=>{const{From:from,Body:body}=req.body;if(!from||!body)return res.status(400).json({success:false,message:'From and Body required'});res.json(processIncomingSMS(from,body));});
  app.get('/api/sms/log',               (req,res)=>{let r=[...smsLog];const max=parseInt(req.query.limit)||50;res.json({success:true,count:r.length,log:r.slice(-max).reverse()});});
  app.get('/api/offers',                (req,res)=>{let r=[...activeOffers];if(req.query.status)r=r.filter(o=>o.status===req.query.status);res.json({success:true,count:r.length,offers:r.reverse()});});
  app.get('/api/trips',                 (req,res)=>{res.json({success:true,count:tripHistory.length,trips:[...tripHistory].reverse()});});
  app.get('/api/edge/cache',            (req,res)=>{res.json({success:true,count:edgeCache.length,cache:edgeCache});});
})();


/* ══════════════════════════════════════════════════════════════════
   FEATURE: DASHBOARD  (was port 3001)
   All routes under /api/dashboard/... and shared /api/drivers, etc.
══════════════════════════════════════════════════════════════════ */
(function registerDashboard() {
  const dashDrivers = [
    { id:'DRV-001', name:'Ahmed K.',  fleet:'alpha',   vehicleType:'heavy',  ecoScore:92, fuelEfficiency:94, onTimeRate:97, totalTrips:234, co2Saved:412.8,  fuelSaved:154.2, greenBonus:1240, status:'in-transit' },
    { id:'DRV-002', name:'Rashid M.', fleet:'alpha',   vehicleType:'heavy',  ecoScore:88, fuelEfficiency:89, onTimeRate:94, totalTrips:198, co2Saved:348.6,  fuelSaved:130.1, greenBonus:980,  status:'in-transit' },
    { id:'DRV-003', name:'Farhan S.', fleet:'alpha',   vehicleType:'medium', ecoScore:85, fuelEfficiency:86, onTimeRate:91, totalTrips:167, co2Saved:278.4,  fuelSaved:103.9, greenBonus:720,  status:'available'  },
    { id:'DRV-004', name:'Omar H.',   fleet:'bravo',   vehicleType:'heavy',  ecoScore:78, fuelEfficiency:76, onTimeRate:88, totalTrips:312, co2Saved:198.2,  fuelSaved:74.0,  greenBonus:560,  status:'returning'  },
    { id:'DRV-005', name:'Yusuf T.',  fleet:'bravo',   vehicleType:'light',  ecoScore:91, fuelEfficiency:93, onTimeRate:96, totalTrips:145, co2Saved:389.1,  fuelSaved:145.2, greenBonus:890,  status:'in-transit' },
    { id:'DRV-006', name:'Khalid N.', fleet:'bravo',   vehicleType:'medium', ecoScore:82, fuelEfficiency:81, onTimeRate:90, totalTrips:201, co2Saved:245.7,  fuelSaved:91.7,  greenBonus:640,  status:'idle'       },
    { id:'DRV-007', name:'Saeed A.',  fleet:'charlie', vehicleType:'heavy',  ecoScore:87, fuelEfficiency:88, onTimeRate:93, totalTrips:276, co2Saved:334.5,  fuelSaved:124.8, greenBonus:910,  status:'in-transit' },
    { id:'DRV-008', name:'Imran B.',  fleet:'charlie', vehicleType:'light',  ecoScore:84, fuelEfficiency:85, onTimeRate:92, totalTrips:89,  co2Saved:212.3,  fuelSaved:79.2,  greenBonus:580,  status:'idle'       },
  ];
  const routesData = {
    standard: { name:'Standard Route (E11 Highway)',          distance:142, fuel:38.2, co2:96.4, time:'2h 15m', inclines:12, congestionZones:5 },
    eco:      { name:'Eco-Optimized Route (E311 Corridor)',   distance:148, fuel:29.1, co2:73.4, time:'2h 25m', inclines:3,  congestionZones:1 },
  };
  const shipments = [
    { id:'SH-4821', origin:'Port Jebel Ali',  dest:'Warehouse B - Al Quoz', weight:12.4, priority:'high',     deadline:new Date(Date.now()+2*3600000).toISOString(),  status:'in-transit', driverId:'DRV-001' },
    { id:'SH-4822', origin:'Port Jebel Ali',  dest:'DIC Free Zone',         weight:8.2,  priority:'medium',   deadline:new Date(Date.now()+6*3600000).toISOString(),  status:'pending',    driverId:null      },
    { id:'SH-4823', origin:'Port Jebel Ali',  dest:'Sharjah Hub',           weight:5.6,  priority:'low',      deadline:new Date(Date.now()+12*3600000).toISOString(), status:'pending',    driverId:null      },
    { id:'SH-4824', origin:'Warehouse B',     dest:'Port Jebel Ali',        weight:0,    priority:'backhaul', deadline:null,                                          status:'backhaul',   driverId:'DRV-004' },
    { id:'SH-4825', origin:'DIC Free Zone',   dest:'Port Rashid',           weight:9.8,  priority:'high',     deadline:new Date(Date.now()+3*3600000).toISOString(),  status:'in-transit', driverId:'DRV-002' },
    { id:'SH-4826', origin:'Sharjah Hub',     dest:'Ajman Depot',           weight:4.2,  priority:'low',      deadline:new Date(Date.now()+8*3600000).toISOString(),  status:'ready',      driverId:null      },
    { id:'SH-4827', origin:'Port Jebel Ali',  dest:'JAFZA Logistics',       weight:11.3, priority:'high',     deadline:new Date(Date.now()+1.5*3600000).toISOString(),status:'in-transit', driverId:'DRV-007' },
    { id:'SH-4828', origin:'Al Quoz',         dest:'Port Jebel Ali',        weight:7.5,  priority:'medium',   deadline:new Date(Date.now()+5*3600000).toISOString(),  status:'in-transit', driverId:'DRV-005' },
  ];
  const carbonWeekly = [
    {day:'Mon',saved:124,emitted:210},{day:'Tue',saved:156,emitted:195},{day:'Wed',saved:189,emitted:178},
    {day:'Thu',saved:201,emitted:162},{day:'Fri',saved:234,emitted:148},{day:'Sat',saved:198,emitted:155},{day:'Sun',saved:167,emitted:170},
  ];
  const fleetLoad = [{name:'Full Load',value:42},{name:'Partial (>70%)',value:31},{name:'Partial (<70%)',value:18},{name:'Empty Return',value:9}];
  const emptyMilesMonthly = [
    {month:'Jan',before:34,after:12},{month:'Feb',before:38,after:9},{month:'Mar',before:31,after:11},
    {month:'Apr',before:42,after:7},{month:'May',before:36,after:8},{month:'Jun',before:29,after:5},
  ];
  const dashMicroHubs = [
    {id:'MH-01',name:'Al Quoz Junction',lat:25.06,lon:55.14,utilizationRate:78,pickupsToday:12,avgDetourKm:2.4},
    {id:'MH-02',name:'E311 Interchange', lat:25.12,lon:55.20,utilizationRate:65,pickupsToday:8, avgDetourKm:3.1},
    {id:'MH-03',name:'DIC Gate',         lat:25.15,lon:55.24,utilizationRate:52,pickupsToday:5, avgDetourKm:1.8},
    {id:'MH-04',name:'JAFZA South',      lat:25.04,lon:55.11,utilizationRate:71,pickupsToday:10,avgDetourKm:2.9},
    {id:'MH-05',name:'Sharjah Corridor', lat:25.09,lon:55.17,utilizationRate:44,pickupsToday:3, avgDetourKm:4.2},
  ];
  const dashAlerts = [
    {id:'ALT-001',type:'warning',  severity:'high',  message:'TRK-004 fuel level at 38% — refuel before next trip',               timestamp:new Date(Date.now()-5*60000).toISOString()},
    {id:'ALT-002',type:'deadline', severity:'high',  message:'SH-4827 deadline approaching — 1.5h remaining',                     timestamp:new Date(Date.now()-12*60000).toISOString()},
    {id:'ALT-003',type:'traffic',  severity:'medium',message:'Congestion on E11 — 25 min delay',                                  timestamp:new Date(Date.now()-18*60000).toISOString()},
    {id:'ALT-004',type:'success',  severity:'low',   message:'DRV-001 completed SH-4821 — 23 kg CO2 saved',                       timestamp:new Date(Date.now()-35*60000).toISOString()},
    {id:'ALT-005',type:'warning',  severity:'medium',message:'SH-4823 deadline in 12h — still unassigned',                       timestamp:new Date(Date.now()-42*60000).toISOString()},
    {id:'ALT-006',type:'milestone',severity:'low',   message:'Weekly CO2 savings exceeded 1,200 kg — new record!',                timestamp:new Date(Date.now()-60*60000).toISOString()},
  ];

  const completedTrips = [];
  for(let i=0;i<180;i++){const dAgo=Math.floor(i/6);const eco=Math.random()>0.15;const dist=80+Math.random()*120;const fStd=(dist/100)*34;const fUsed=eco?fStd*(0.72+Math.random()*0.08):fStd;const fSaved=Math.max(0,fStd-fUsed);completedTrips.push({id:`TRP-${1000+i}`,date:new Date(Date.now()-dAgo*86400000).toISOString(),driverId:dashDrivers[i%dashDrivers.length].id,distanceKm:Math.round(dist*10)/10,fuelUsed:Math.round(fUsed*10)/10,fuelSaved:Math.round(fSaved*10)/10,co2Saved:Math.round(fSaved*2.68*10)/10,ecoRoute:eco,onTime:Math.random()>0.08});}

  let tick=0;
  function getLiveStats(){tick++;return{co2SavedToday:{value:Math.round((1269+tick*2.3)*10)/10,unit:'kg',trend:'+23% vs last week'},fuelSavedToday:{value:Math.round(342+tick*0.8),unit:'L',trend:'+18% efficiency'},activeTrips:{value:47+Math.floor(tick/4),ecoRouted:Math.floor((47+Math.floor(tick/4))*0.91)},emptyMilesEliminated:{value:89,unit:'%'},timestamp:new Date().toISOString()};}
  function calcSavings(fuelL,co2Kg){const f=fuelL*3.32,c=co2Kg*0.28,m=fuelL*0.15;return{fuelCostSaved:Math.round(f*100)/100,carbonCreditValue:Math.round(c*100)/100,maintenanceSaved:Math.round(m*100)/100,totalSaved:Math.round((f+c+m)*100)/100,currency:'AED'};}

  app.get('/api/dashboard',             (req,res)=>{const s=getLiveStats();const t30=completedTrips.slice(0,60);const sv=calcSavings(t30.reduce((a,x)=>a+x.fuelSaved,0),t30.reduce((a,x)=>a+x.co2Saved,0));res.json({success:true,liveStats:s,routes:routesData,carbonWeekly,fleetLoad,emptyMilesMonthly,shipments:shipments.slice(0,6),costSavings:sv,recentAlerts:dashAlerts.slice(0,5),microHubSummary:{avgUtilization:Math.round(dashMicroHubs.reduce((a,h)=>a+h.utilizationRate,0)/dashMicroHubs.length),totalPickupsToday:dashMicroHubs.reduce((a,h)=>a+h.pickupsToday,0)},timestamp:new Date().toISOString()});});
  app.get('/api/stats/live',            (req,res)=>{res.json({success:true,stats:getLiveStats()});});
  app.get('/api/routes/compare',        (req,res)=>{const s={fuelSaved:Math.round((routesData.standard.fuel-routesData.eco.fuel)*10)/10,co2Saved:Math.round((routesData.standard.co2-routesData.eco.co2)*10)/10,extraTime:'10 min',inclinesSaved:routesData.standard.inclines-routesData.eco.inclines};res.json({success:true,standard:routesData.standard,eco:routesData.eco,savings:s});});
  app.get('/api/carbon/weekly',         (req,res)=>{res.json({success:true,data:carbonWeekly});});
  app.get('/api/fleet/load-distribution',(req,res)=>{res.json({success:true,data:fleetLoad});});
  app.get('/api/fleet/empty-miles',     (req,res)=>{res.json({success:true,data:emptyMilesMonthly});});
  app.get('/api/shipments',             (req,res)=>{let r=[...shipments];if(req.query.status)r=r.filter(s=>s.status===req.query.status);res.json({success:true,count:r.length,shipments:r});});
  app.get('/api/drivers',               (req,res)=>{let r=[...dashDrivers];if(req.query.status)r=r.filter(d=>d.status===req.query.status);if(req.query.fleet)r=r.filter(d=>d.fleet===req.query.fleet);res.json({success:true,count:r.length,drivers:r});});
  app.get('/api/drivers/leaderboard',   (req,res)=>{const sf=req.query.sort||'ecoScore';const ranked=[...dashDrivers].sort((a,b)=>b[sf]-a[sf]).map((d,i)=>({rank:i+1,...d}));res.json({success:true,sortedBy:sf,leaderboard:ranked});});
  app.get('/api/alerts',                (req,res)=>{res.json({success:true,count:dashAlerts.length,alerts:dashAlerts});});
  app.post('/api/alerts',               (req,res)=>{const a={id:`ALT-${String(dashAlerts.length+1).padStart(3,'0')}`,type:req.body.type||'info',severity:req.body.severity||'low',message:req.body.message,timestamp:new Date().toISOString()};dashAlerts.unshift(a);res.status(201).json({success:true,alert:a});});
  app.get('/api/micro-hubs',            (req,res)=>{res.json({success:true,count:dashMicroHubs.length,hubs:dashMicroHubs,summary:{avgUtilization:Math.round(dashMicroHubs.reduce((a,h)=>a+h.utilizationRate,0)/dashMicroHubs.length),totalPickupsToday:dashMicroHubs.reduce((a,h)=>a+h.pickupsToday,0)}});});
  app.get('/api/savings/calculate',     (req,res)=>{const fuelL=parseFloat(req.query.fuel)||getLiveStats().fuelSavedToday.value;const co2=parseFloat(req.query.co2)||getLiveStats().co2SavedToday.value;res.json({success:true,...calcSavings(fuelL,co2)});});
})();


/* ══════════════════════════════════════════════════════════════════
   FEATURE: ECO-ROUTING  (was port 3002)
   Routes under /api/routing/... and /api/dispatch/... etc.
══════════════════════════════════════════════════════════════════ */
(function registerEcoRouting() {
  const CONFIG = {goldenRatio:{carbonWeight:0.618,urgencyWeight:0.382},dispatch:{minThreshold:55,maxThreshold:95},microHub:{searchRadiusKm:15,maxDetourKm:8}};

  const routeSegments = [
    {id:'SEG-01',name:'Sheikh Zayed Rd (E11)',  from:'Port Jebel Ali',     to:'Al Quoz Junction',   distanceKm:18.4,baseTimeMin:22,inclineGrade:0.5,congestionLevel:'heavy',   tollAED:4, maxSpeedKmh:120,surface:'highway'},
    {id:'SEG-02',name:'E311 Corridor',           from:'Port Jebel Ali',     to:'E311/Al Quoz Exit',  distanceKm:22.1,baseTimeMin:26,inclineGrade:1.2,congestionLevel:'light',   tollAED:0, maxSpeedKmh:110,surface:'highway'},
    {id:'SEG-03',name:'Al Quoz Industrial Rd',   from:'Al Quoz Junction',   to:'Warehouse B',        distanceKm:6.8, baseTimeMin:14,inclineGrade:0.3,congestionLevel:'moderate',tollAED:0, maxSpeedKmh:60, surface:'urban'},
    {id:'SEG-04',name:'E311 to Sharjah Link',    from:'E311/Al Quoz Exit',  to:'Sharjah Hub',        distanceKm:28.4,baseTimeMin:32,inclineGrade:2.8,congestionLevel:'light',   tollAED:8, maxSpeedKmh:100,surface:'highway'},
    {id:'SEG-05',name:'DIC Access Road',         from:'E311/Al Quoz Exit',  to:'DIC Free Zone',      distanceKm:8.2, baseTimeMin:12,inclineGrade:0.8,congestionLevel:'light',   tollAED:0, maxSpeedKmh:80, surface:'urban'},
    {id:'SEG-06',name:'Emirates Rd (E611)',       from:'Port Jebel Ali',     to:'Sharjah Hub',        distanceKm:52.3,baseTimeMin:48,inclineGrade:3.5,congestionLevel:'moderate',tollAED:12,maxSpeedKmh:120,surface:'highway'},
    {id:'SEG-09',name:'Ajman Coastal Rd',         from:'Sharjah Hub',        to:'Ajman Depot',        distanceKm:12.8,baseTimeMin:18,inclineGrade:0.2,congestionLevel:'light',   tollAED:0, maxSpeedKmh:80, surface:'coastal'},
  ];
  const predefinedRoutes = [
    {id:'RT-STD-01',name:'Standard: Jebel Ali→Warehouse B (E11)',type:'standard',segments:['SEG-01','SEG-03'],totalDistanceKm:25.2,totalTimeMin:36,totalTollAED:4, totalFuelL:8.6, totalCO2Kg:23.0,maxIncline:0.5,congestionRisk:'high'},
    {id:'RT-ECO-01',name:'Eco: Jebel Ali→Warehouse B (E311)',    type:'eco',     segments:['SEG-02','SEG-03'],totalDistanceKm:28.9,totalTimeMin:40,totalTollAED:0, totalFuelL:6.5, totalCO2Kg:17.4,maxIncline:1.2,congestionRisk:'low'},
    {id:'RT-STD-02',name:'Standard: Jebel Ali→Sharjah Hub (E611)',type:'standard',segments:['SEG-06'],        totalDistanceKm:52.3,totalTimeMin:48,totalTollAED:12,totalFuelL:17.8,totalCO2Kg:47.7,maxIncline:3.5,congestionRisk:'medium'},
    {id:'RT-ECO-02',name:'Eco: Jebel Ali→Sharjah Hub (E311)',    type:'eco',     segments:['SEG-02','SEG-04'],totalDistanceKm:50.5,totalTimeMin:58,totalTollAED:8, totalFuelL:14.2,totalCO2Kg:38.1,maxIncline:2.8,congestionRisk:'low'},
    {id:'RT-ECO-03',name:'Eco: Jebel Ali→DIC Free Zone',        type:'eco',     segments:['SEG-02','SEG-05'],totalDistanceKm:30.3,totalTimeMin:38,totalTollAED:0, totalFuelL:8.1, totalCO2Kg:21.7,maxIncline:1.2,congestionRisk:'low'},
  ];
  const trafficConditions = {
    'SEG-01':{currentDelay:18,reason:'Rush hour congestion',severity:'heavy'},
    'SEG-02':{currentDelay:3, reason:'Normal flow',          severity:'light'},
    'SEG-03':{currentDelay:8, reason:'Road works near Al Quoz',severity:'moderate'},
    'SEG-04':{currentDelay:2, reason:'Clear',                severity:'light'},
    'SEG-05':{currentDelay:4, reason:'Minor slowdown',       severity:'light'},
    'SEG-06':{currentDelay:12,reason:'Accident at km 34',    severity:'heavy'},
  };
  const weatherData = {current:{regions:{
    'Dubai-South':{temp:38,humidity:55,condition:'Clear',         windKmh:12,visibility:'good',    rainProbability:5, severity:'safe'},
    'Dubai-Central':{temp:39,humidity:52,condition:'Hazy',        windKmh:15,visibility:'moderate',rainProbability:10,severity:'safe'},
    'Sharjah':      {temp:37,humidity:68,condition:'Thunderstorm',windKmh:35,visibility:'poor',    rainProbability:78,severity:'danger'},
    'Ajman':        {temp:36,humidity:72,condition:'Heavy Rain',   windKmh:42,visibility:'very-poor',rainProbability:92,severity:'danger'},
    'JAFZA':        {temp:38,humidity:50,condition:'Clear',        windKmh:10,visibility:'good',   rainProbability:3, severity:'safe'},
  }}};
  const vehicles = [
    {id:'TRK-001',driver:'Ahmed K.',  type:'heavy',maxLoad:18,currentLoad:12.4,status:'in-transit', currentRoute:'RT-ECO-01'},
    {id:'TRK-002',driver:'Rashid M.', type:'heavy',maxLoad:18,currentLoad:9.8, status:'in-transit', currentRoute:'RT-ECO-02'},
    {id:'TRK-003',driver:'Farhan S.', type:'medium',maxLoad:10,currentLoad:5.6,status:'loading',    currentRoute:null},
    {id:'TRK-004',driver:'Omar H.',   type:'heavy',maxLoad:18,currentLoad:0,   status:'returning',  currentRoute:null},
    {id:'TRK-005',driver:'Yusuf T.',  type:'light', maxLoad:6, currentLoad:4.2,status:'in-transit', currentRoute:'RT-ECO-03'},
  ];

  function goldenRatioDispatch(loadPct,urgency){
    const{carbonWeight,urgencyWeight}=CONFIG.goldenRatio;
    const blended=loadPct*carbonWeight+urgency*urgencyWeight;
    const threshold=Math.max(CONFIG.dispatch.minThreshold,CONFIG.dispatch.maxThreshold-(urgency*0.5));
    const go=loadPct>=threshold;
    return{loadPercent:loadPct,urgencyScore:urgency,blendedScore:Math.round(blended*10)/10,dynamicThreshold:Math.round(threshold*10)/10,shouldDispatch:go,decision:go?'DISPATCH NOW':'WAIT — Fill to threshold',weights:{carbon:carbonWeight,urgency:urgencyWeight}};
  }
  function scoreRoute(route,loadTons,vehicleType){
    const p=loadTons>10?'heavy':loadTons>5?'medium':'light';
    const incPen=p==='heavy'?route.maxIncline*8:p==='medium'?route.maxIncline*4:route.maxIncline;
    const congPen={high:20,medium:10,low:2}[route.congestionRisk]||5;
    const tollPen=route.totalTollAED*0.5;
    const bFuel=p==='heavy'?34:p==='medium'?26:18;
    const adjFuel=(route.totalDistanceKm/100)*bFuel*(1+(loadTons/20)*0.3);
    const fuelScore=Math.max(0,100-adjFuel*2);
    const total=Math.max(0,fuelScore-incPen-congPen-tollPen);
    return{routeId:route.id,routeName:route.name,vehicleProfile:p,scores:{fuelEfficiency:Math.round(fuelScore*10)/10,inclinePenalty:Math.round(incPen*10)/10,congestionPenalty:congPen,tollPenalty:tollPen,totalScore:Math.round(total*10)/10},estimatedFuelL:Math.round(adjFuel*10)/10,estimatedCO2Kg:Math.round(adjFuel*2.68*10)/10,tollCostAED:route.totalTollAED,recommendation:total>60?'Recommended':total>35?'Acceptable':'Avoid'};
  }

  // Simple /routes endpoint used by the ecorouting frontend
  app.get('/routes',                      (req,res)=>{res.json(predefinedRoutes.map(r=>({id:r.id,name:r.name,type:r.type,distanceKm:r.totalDistanceKm,timeMin:r.totalTimeMin,fuelL:r.totalFuelL,co2Kg:r.totalCO2Kg,congestionRisk:r.congestionRisk})));});
  app.get('/api/routing/routes',          (req,res)=>{res.json({success:true,count:predefinedRoutes.length,routes:predefinedRoutes});});
  app.get('/api/routing/segments',        (req,res)=>{res.json({success:true,count:routeSegments.length,segments:routeSegments});});
  app.get('/api/routing/optimize',        (req,res)=>{const load=parseFloat(req.query.load)||12;const vt=req.query.vehicle||'heavy';const sc=predefinedRoutes.map(r=>scoreRoute(r,load,vt)).sort((a,b)=>b.scores.totalScore-a.scores.totalScore);res.json({success:true,loadTons:load,bestRoute:sc[0],allRoutes:sc});});
  app.get('/api/dispatch/calculate',      (req,res)=>{res.json({success:true,...goldenRatioDispatch(parseFloat(req.query.load)||72,parseFloat(req.query.urgency)||50)});});
  app.post('/api/dispatch/evaluate',      (req,res)=>{const{loadPercent,urgencyScore}=req.body;if(loadPercent===undefined)return res.status(400).json({success:false,message:'loadPercent required'});res.json({success:true,...goldenRatioDispatch(loadPercent,urgencyScore||50)});});
  app.get('/api/traffic',                 (req,res)=>{res.json({success:true,conditions:trafficConditions,updatedAt:new Date().toISOString()});});
  app.get('/api/weather',                 (req,res)=>{res.json({success:true,...weatherData});});
  app.get('/api/vehicles',                (req,res)=>{res.json({success:true,count:vehicles.length,vehicles});});
})();


/* ══════════════════════════════════════════════════════════════════
   FEATURE: BACKHAULING  (was port 3000)
   Backhauling logic: /api/backhaul/..., /api/analytics/...
   Drivers+deliveries share namespace with dashboard above.
   We use separate /api/bh/ prefix to avoid collision.
══════════════════════════════════════════════════════════════════ */
(function registerBackhauling() {
  const CONFIG = {searchRadiusKm:40,offerExpiryMinutes:60,maxExtraDistanceKm:25,greenBonusBaseAed:50,carbonWeight:0.618,urgencyWeight:0.382};

  const bhDrivers = [
    {id:'DRV-001',name:'Ahmed K.',  phone:'+971501234001',vehicleType:'heavy', maxLoad:18,lat:25.013,lon:55.073,status:'available',  currentTrip:null,   backhaulsCompleted:12,co2Saved:82.4, greenBonusEarned:720},
    {id:'DRV-002',name:'Rashid M.', phone:'+971501234002',vehicleType:'heavy', maxLoad:18,lat:25.068,lon:55.148,status:'in-transit', currentTrip:'TRP-A',backhaulsCompleted:9, co2Saved:61.2, greenBonusEarned:520},
    {id:'DRV-003',name:'Farhan S.', phone:'+971501234003',vehicleType:'medium',maxLoad:10,lat:25.122,lon:55.201,status:'returning',  currentTrip:null,   backhaulsCompleted:6, co2Saved:38.8, greenBonusEarned:340},
    {id:'DRV-004',name:'Omar H.',   phone:'+971501234004',vehicleType:'heavy', maxLoad:18,lat:25.019,lon:55.082,status:'available',  currentTrip:null,   backhaulsCompleted:15,co2Saved:102.6,greenBonusEarned:940},
    {id:'DRV-005',name:'Yusuf T.',  phone:'+971501234005',vehicleType:'light', maxLoad:6, lat:25.155,lon:55.238,status:'in-transit', currentTrip:'TRP-B',backhaulsCompleted:4, co2Saved:22.1, greenBonusEarned:200},
  ];
  const deliveries = [
    {id:'DEL-001',origin:'Port Jebel Ali',dest:'Warehouse B - Al Quoz',originLat:25.0136,originLon:55.0737,destLat:25.1976,destLon:55.2742,weight:8.2,cargoType:'general',priority:'medium',status:'awaiting-backhaul',createdAt:new Date(Date.now()-2*3600000).toISOString(),deadline:new Date(Date.now()+4*3600000).toISOString()},
    {id:'DEL-002',origin:'DIC Free Zone',  dest:'Port Jebel Ali',      originLat:25.155, originLon:55.238, destLat:25.0136,destLon:55.0737,weight:5.4,cargoType:'electronics',priority:'high',  status:'awaiting-backhaul',createdAt:new Date(Date.now()-1*3600000).toISOString(),deadline:new Date(Date.now()+2*3600000).toISOString()},
    {id:'DEL-003',origin:'Sharjah Hub',    dest:'JAFZA Logistics',     originLat:25.185, originLon:55.262, destLat:25.04,  destLon:55.11,  weight:3.1,cargoType:'perishable',priority:'high',  status:'awaiting-backhaul',createdAt:new Date(Date.now()-0.5*3600000).toISOString(),deadline:new Date(Date.now()+1.5*3600000).toISOString()},
    {id:'DEL-004',origin:'Ajman Depot',    dest:'Port Rashid',         originLat:25.41,  originLon:55.44,  destLat:25.276, destLon:55.296, weight:7.8,cargoType:'general',   priority:'low',   status:'awaiting-backhaul',createdAt:new Date(Date.now()-4*3600000).toISOString(),deadline:new Date(Date.now()+8*3600000).toISOString()},
  ];
  const bhOffers = [];
  const bhSmsLog = [];
  let offerSeq = 0;

  function haversine(la1,lo1,la2,lo2){const R=6371,dLa=(la2-la1)*Math.PI/180,dLo=(lo2-lo1)*Math.PI/180,a=Math.sin(dLa/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLo/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));}
  function bhGenId(p){return`${p}-${String(++offerSeq).padStart(4,'0')}`;}

  function findBackhaulMatches(driverId){
    const drv=bhDrivers.find(d=>d.id===driverId);
    if(!drv)return[];
    const available=deliveries.filter(d=>d.status==='awaiting-backhaul');
    return available.map(del=>{
      const distToPickup=haversine(drv.lat,drv.lon,del.originLat,del.originLon);
      const deliveryDist=haversine(del.originLat,del.originLon,del.destLat,del.destLon);
      const extraDist=distToPickup;
      if(extraDist>CONFIG.maxExtraDistanceKm)return null;
      const fuelL=deliveryDist*0.32;
      const co2=fuelL*2.68;
      const urgency=del.priority==='high'?80:del.priority==='medium'?50:20;
      const score=Math.round((co2*CONFIG.carbonWeight+urgency*CONFIG.urgencyWeight)*10)/10;
      const bonus=Math.round(CONFIG.greenBonusBaseAed+(co2*0.5));
      return{deliveryId:del.id,origin:del.origin,dest:del.dest,weight:del.weight,cargoType:del.cargoType,priority:del.priority,distToPickupKm:Math.round(distToPickup*10)/10,deliveryDistKm:Math.round(deliveryDist*10)/10,extraDistKm:Math.round(extraDist*10)/10,fuelSavedL:Math.round(fuelL*10)/10,co2SavedKg:Math.round(co2*10)/10,greenBonusAed:bonus,score,deadline:del.deadline};
    }).filter(Boolean).sort((a,b)=>b.score-a.score);
  }

  app.get('/api/bh/drivers',                      (req,res)=>{res.json({success:true,count:bhDrivers.length,drivers:bhDrivers});});
  app.get('/api/bh/drivers/leaderboard',           (req,res)=>{const lb=[...bhDrivers].sort((a,b)=>b.co2Saved-a.co2Saved).map((d,i)=>({rank:i+1,...d}));res.json({success:true,leaderboard:lb});});
  app.get('/api/bh/deliveries',                    (req,res)=>{res.json({success:true,count:deliveries.length,deliveries});});
  app.post('/api/bh/deliveries',                   (req,res)=>{const d={id:bhGenId('DEL'),status:'awaiting-backhaul',createdAt:new Date().toISOString(),...req.body};deliveries.push(d);res.status(201).json({success:true,delivery:d});});
  app.get('/api/bh/backhaul/matches/:driverId',    (req,res)=>{const m=findBackhaulMatches(req.params.driverId);res.json({success:true,driverId:req.params.driverId,matchCount:m.length,matches:m});});
  app.post('/api/bh/backhaul/offer',               (req,res)=>{const{driverId,deliveryId}=req.body;const drv=bhDrivers.find(d=>d.id===driverId);const del=deliveries.find(d=>d.id===deliveryId);if(!drv||!del)return res.status(404).json({success:false,message:'Driver or delivery not found'});const offer={id:bhGenId('OFR'),driverId,deliveryId,status:'pending',createdAt:new Date().toISOString(),expiresAt:new Date(Date.now()+CONFIG.offerExpiryMinutes*60000).toISOString(),greenBonusAed:Math.round(CONFIG.greenBonusBaseAed+30)};bhOffers.push(offer);del.status='offered';bhSmsLog.push({to:drv.phone,msg:`BACKHAUL OFFER: ${del.origin}→${del.dest}. ${del.weight}T. Reply 1=ACCEPT 2=REJECT`,timestamp:new Date().toISOString()});res.status(201).json({success:true,offer});});
  app.post('/api/bh/backhaul/offer/:offerId/accept',(req,res)=>{const o=bhOffers.find(x=>x.id===req.params.offerId);if(!o)return res.status(404).json({success:false,message:'Offer not found'});o.status='accepted';const drv=bhDrivers.find(d=>d.id===o.driverId);const del=deliveries.find(d=>d.id===o.deliveryId);if(drv)drv.status='in-transit';if(del)del.status='in-transit';res.json({success:true,offer:o,message:'Backhaul accepted'});});
  app.post('/api/bh/backhaul/offer/:offerId/reject',(req,res)=>{const o=bhOffers.find(x=>x.id===req.params.offerId);if(!o)return res.status(404).json({success:false,message:'Offer not found'});o.status='rejected';const del=deliveries.find(d=>d.id===o.deliveryId);if(del)del.status='awaiting-backhaul';res.json({success:true,offer:o});});
  app.get('/api/bh/backhaul/offers',               (req,res)=>{res.json({success:true,count:bhOffers.length,offers:bhOffers});});
  app.get('/api/bh/sms/log',                       (req,res)=>{res.json({success:true,count:bhSmsLog.length,log:bhSmsLog});});
  app.get('/api/bh/analytics/dashboard',           (req,res)=>{
    const totalCo2=bhDrivers.reduce((s,d)=>s+d.co2Saved,0);
    const totalBonus=bhDrivers.reduce((s,d)=>s+d.greenBonusEarned,0);
    const totalBackhauls=bhDrivers.reduce((s,d)=>s+d.backhaulsCompleted,0);
    res.json({success:true,summary:{totalCo2SavedKg:Math.round(totalCo2*10)/10,totalGreenBonusAed:totalBonus,totalBackhaulsCompleted:totalBackhauls,emptyMilesEliminated:'78%',activeDrivers:bhDrivers.filter(d=>d.status==='available'||d.status==='in-transit').length},drivers:bhDrivers,recentOffers:bhOffers.slice(-5).reverse(),timestamp:new Date().toISOString()});
  });
})();


/* ══════════════════════════════════════════════════════════════════
   GLOBAL HEALTH + ROOT
══════════════════════════════════════════════════════════════════ */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok', service: 'EcoLogix Unified API', version: '1.0.0',
    features: ['SMS Assistant', 'Dashboard', 'Eco-Routing', 'Backhauling'],
    uptime: process.uptime(), timestamp: new Date().toISOString(),
  });
});

/* ══════════════════════════════════════════════════════════════════
   SPA FALLBACK
══════════════════════════════════════════════════════════════════ */
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

/* ══════════════════════════════════════════════════════════════════
   START
══════════════════════════════════════════════════════════════════ */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('\n┌─────────────────────────────────────────────────┐');
  console.log('│  🌿  EcoLogix — Unified Platform                │');
  console.log(`│  http://localhost:${PORT}                          │`);
  console.log('├─────────────────────────────────────────────────┤');
  console.log('│  ✓ SMS Assistant   → /api/loads  /api/sms       │');
  console.log('│  ✓ Dashboard       → /api/dashboard /api/stats  │');
  console.log('│  ✓ Eco-Routing     → /api/routing  /routes      │');
  console.log('│  ✓ Backhauling     → /api/bh/backhaul           │');
  console.log('│  ✓ Frontend        → /public (static)           │');
  console.log('└─────────────────────────────────────────────────┘\n');
});

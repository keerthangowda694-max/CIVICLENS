const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Complaint = require('./models/Complaint');
const IssueCluster = require('./models/IssueCluster');
const StatusHistory = require('./models/StatusHistory');
const Verification = require('./models/Verification');
const Notification = require('./models/Notification');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/civiclens';

async function seedDatabase() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(MONGODB_URI);
    }

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Complaint.deleteMany({});
    await IssueCluster.deleteMany({});
    await StatusHistory.deleteMany({});
    await Verification.deleteMany({});
    await Notification.deleteMany({});

    console.log('Seeding demo users...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const citizenAlex = await User.create({
      name: 'Alex Rivera',
      email: 'citizen@civiclens.ai',
      password: hashedPassword,
      role: 'citizen',
      area: 'North College Boulevard',
      points: 240,
      badges: [
        { id: 'civic-observer', name: 'Civic Observer', icon: '🏙️', description: 'Active spotter of urban infrastructure anomalies' },
        { id: 'issue-spotter', name: 'Issue Spotter', icon: '🔎', description: 'Submitted 10+ high-fidelity verified civic reports' },
        { id: 'community-helper', name: 'Community Helper', icon: '🤝', description: 'Participated in ground-truth resolution verifications' }
      ]
    });

    const authoritySarah = await User.create({
      name: 'Sarah Jenkins',
      email: 'admin@civiclens.ai',
      password: hashedPassword,
      role: 'authority',
      department: 'Public Works',
      area: 'Central Municipal Headquarters',
      points: 450,
      badges: [
        { id: 'operations-lead', name: 'Operations Chief', icon: '⚡', description: 'Municipal Command Center Dispatcher' }
      ]
    });

    console.log('Seeding Issue Clusters...');
    // Cluster 1: Main Road Pothole
    const cluster1 = await IssueCluster.create({
      title: 'Main Road Pothole Cluster',
      category: 'Road Infrastructure',
      department: 'Public Works',
      location: 'Outside University Gate, College Blvd',
      coordinates: { lat: 12.9734, lng: 77.5962 },
      similarityScore: 89,
      impactScore: 94,
      reportCount: 8,
      status: 'ACTIVE'
    });

    // Cluster 2: Central Market Garbage Overflow
    const cluster2 = await IssueCluster.create({
      title: 'Central Market Garbage Accumulation',
      category: 'Municipal Sanitation',
      department: 'Municipal Sanitation',
      location: 'Commercial Market St, Gate 3',
      coordinates: { lat: 12.9785, lng: 77.5921 },
      similarityScore: 92,
      impactScore: 82,
      reportCount: 5,
      status: 'ACTIVE'
    });

    // Cluster 3: Sector 4 Water Main Burst
    const cluster3 = await IssueCluster.create({
      title: 'Sector 4 Water Pipeline Rupture',
      category: 'Water Supply & Drainage',
      department: 'Water Supply & Sewerage Board',
      location: '4th Cross, Industrial Layout',
      coordinates: { lat: 12.9652, lng: 77.6015 },
      similarityScore: 95,
      impactScore: 89,
      reportCount: 6,
      status: 'INVESTIGATING'
    });

    console.log('Seeding 14 realistic civic issues...');

    // Verified resolution photos and original photos using clean public Unsplash CDN URLs
    const potholeBefore = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80';
    const potholeAfter = 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80';
    
    const garbageBefore = 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80';
    const garbageAfter = 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80';
    
    const streetlightBefore = 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80';
    const streetlightAfter = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80';
    
    const waterBefore = 'https://images.unsplash.com/photo-1527525443983-6e60c75fff46?auto=format&fit=crop&w=800&q=80';
    const drainBefore = 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=800&q=80';

    const complaintsData = [
      // 1. High Impact Urgent Road Issue (Live Demo Star Issue)
      {
        title: 'Huge Pothole Outside University Gate',
        description: 'There is a massive 2-foot deep pothole outside the college main gate. Vehicles and city buses are suddenly braking and swerving into oncoming traffic.',
        images: [potholeBefore],
        location: 'College Gate, North Blvd',
        coordinates: { lat: 12.9734, lng: 77.5962 },
        category: 'Road Infrastructure',
        department: 'Public Works',
        assignedDepartment: 'Public Works',
        severity: 'Critical',
        publicImpact: 'Severe',
        summary: 'Deep roadway fissure causing vehicular emergency braking and severe collision hazard near major educational institution.',
        keywords: ['pothole', 'college gate', 'braking', 'asphalt crater', 'traffic danger'],
        priorityScore: 94,
        priorityLevel: 'URGENT',
        impactFactors: { severity: 38, publicExposure: 24, reportFrequency: 19, locationImportance: 9, recency: 5 },
        status: 'IN_PROGRESS',
        reportedBy: citizenAlex._id,
        reporterName: 'Alex Rivera',
        duplicateGroupId: cluster1._id,
        isClusterLeader: true,
        relatedReportsCount: 8,
        aiAnalysis: {
          detectedIssue: 'Road Pothole & Surface Collapse',
          confidence: 94,
          possibleRisk: 'High-speed vehicular damage, sudden braking collisions, severe hazard for two-wheelers',
          suggestedCategory: 'Road Infrastructure',
          suggestedDepartment: 'Public Works',
          isFallback: false,
          whyReasons: [
            'High severity crater (38/40) with depth exceeding 15cm',
            'Heavy commuter volume with 8 related reports clustered within 150m',
            'Prime location exposure directly adjacent to University transit gates',
            'Recency velocity: 5 reports in past 6 hours'
          ]
        }
      },
      // 2. Resolved Road Issue with Before/After proof
      {
        title: 'Asphalt Trench on 5th Main Avenue',
        description: 'Deep trench dug for underground utility pipe left open without barricades or asphalt patch.',
        images: [potholeBefore],
        location: '5th Main Avenue, Sector 2',
        coordinates: { lat: 12.9712, lng: 77.5990 },
        category: 'Road Infrastructure',
        department: 'Public Works',
        assignedDepartment: 'Public Works',
        severity: 'High',
        publicImpact: 'High',
        summary: 'Open utility trench across dual carriageway. Resurfaced and hot-mix sealed.',
        keywords: ['trench', 'asphalt', 'utility', 'barricade'],
        priorityScore: 84,
        priorityLevel: 'HIGH',
        impactFactors: { severity: 32, publicExposure: 20, reportFrequency: 14, locationImportance: 8, recency: 4 },
        status: 'RESOLVED',
        reportedBy: citizenAlex._id,
        reporterName: 'Alex Rivera',
        duplicateGroupId: null,
        relatedReportsCount: 3,
        resolutionProof: {
          image: potholeAfter,
          notes: 'Hot-mix bituminous asphalt patch applied by Public Works Unit #4. Level compaction verified.',
          resolvedByName: 'Sarah Jenkins',
          resolvedAt: new Date(Date.now() - 86400000)
        },
        verificationSummary: {
          totalVotes: 4,
          resolvedVotes: 4,
          partialVotes: 0,
          unresolvedVotes: 0,
          status: 'CONFIRMED_RESOLVED'
        },
        aiAnalysis: {
          detectedIssue: 'Roadway Trench Obstruction',
          confidence: 90,
          possibleRisk: 'Axle damage and vehicle grounding',
          suggestedCategory: 'Road Infrastructure',
          suggestedDepartment: 'Public Works',
          isFallback: false,
          whyReasons: ['Arterial road exposure', 'Unmarked excavation hazard']
        }
      },
      // 3. High Impact Water Pipeline Rupture
      {
        title: 'Pressurized Water Main Rupture on 4th Cross',
        description: 'Potable water main burst underground. High pressure water flooding the road and eroding sub-base pavement.',
        images: [waterBefore],
        location: '4th Cross, Industrial Layout',
        coordinates: { lat: 12.9652, lng: 77.6015 },
        category: 'Water Supply & Drainage',
        department: 'Water Supply & Sewerage Board',
        assignedDepartment: 'Water Supply & Sewerage Board',
        severity: 'High',
        publicImpact: 'Severe',
        summary: 'Underground high-pressure pipe breach eroding road foundation and causing water loss.',
        keywords: ['water burst', 'flooding', 'pipeline', 'erosion'],
        priorityScore: 89,
        priorityLevel: 'URGENT',
        impactFactors: { severity: 35, publicExposure: 22, reportFrequency: 18, locationImportance: 9, recency: 5 },
        status: 'ASSIGNED',
        reportedBy: citizenAlex._id,
        reporterName: 'Alex Rivera',
        duplicateGroupId: cluster3._id,
        isClusterLeader: true,
        relatedReportsCount: 6,
        aiAnalysis: {
          detectedIssue: 'Water Pipeline Rupture',
          confidence: 93,
          possibleRisk: 'Road collapse, clean water wastage, electrical conduit submersion',
          suggestedCategory: 'Water Supply & Drainage',
          suggestedDepartment: 'Water Supply & Sewerage Board',
          isFallback: false,
          whyReasons: ['Massive potable water volume loss', 'Road structural undermining']
        }
      },
      // 4. Sanitation Garbage Overflow
      {
        title: 'Overflowing Waste Dump at Central Market',
        description: 'Multiple bins overflowing into pedestrian walkway for 4 days. Strong odor and stray animals obstructing entrance.',
        images: [garbageBefore],
        location: 'Commercial Market St, Gate 3',
        coordinates: { lat: 12.9785, lng: 77.5921 },
        category: 'Municipal Sanitation',
        department: 'Municipal Sanitation',
        assignedDepartment: 'Municipal Sanitation',
        severity: 'High',
        publicImpact: 'High',
        summary: 'Commercial zone garbage backlog spilling onto thoroughfare with biohazard risk.',
        keywords: ['garbage', 'dump', 'waste', 'smell', 'market'],
        priorityScore: 82,
        priorityLevel: 'HIGH',
        impactFactors: { severity: 30, publicExposure: 21, reportFrequency: 17, locationImportance: 8, recency: 5 },
        status: 'IN_PROGRESS',
        reportedBy: null,
        reporterName: 'Priya Sharma',
        duplicateGroupId: cluster2._id,
        isClusterLeader: true,
        relatedReportsCount: 5,
        aiAnalysis: {
          detectedIssue: 'Commercial Waste Accumulation',
          confidence: 91,
          possibleRisk: 'Disease vectors, rodent infestation, pedestrian blockade',
          suggestedCategory: 'Municipal Sanitation',
          suggestedDepartment: 'Municipal Sanitation',
          isFallback: false,
          whyReasons: ['High density commercial footfall', '5 corroborating citizen reports']
        }
      },
      // 5. Resolved Sanitation Issue with Before/After
      {
        title: 'Illegal Debris Dumping in Residential Alley',
        description: 'Construction debris and domestic trash dumped illegally along the community park wall.',
        images: [garbageBefore],
        location: 'Park View Lane, Sector 3',
        coordinates: { lat: 12.9750, lng: 77.5890 },
        category: 'Municipal Sanitation',
        department: 'Municipal Sanitation',
        assignedDepartment: 'Municipal Sanitation',
        severity: 'Medium',
        publicImpact: 'Medium',
        summary: 'Illegal debris dumping cleared and sanitized with community signage installed.',
        keywords: ['debris', 'dumping', 'park', 'trash'],
        priorityScore: 68,
        priorityLevel: 'MEDIUM',
        impactFactors: { severity: 24, publicExposure: 18, reportFrequency: 12, locationImportance: 8, recency: 4 },
        status: 'RESOLVED',
        reportedBy: citizenAlex._id,
        reporterName: 'Alex Rivera',
        resolutionProof: {
          image: garbageAfter,
          notes: 'Sanitation squad cleared 3 metric tons of debris. Disinfected perimeter and posted penalty warning board.',
          resolvedByName: 'Municipal Sanitation Squad 7',
          resolvedAt: new Date(Date.now() - 172800000)
        },
        verificationSummary: {
          totalVotes: 3,
          resolvedVotes: 3,
          partialVotes: 0,
          unresolvedVotes: 0,
          status: 'CONFIRMED_RESOLVED'
        },
        aiAnalysis: {
          detectedIssue: 'Illegal Dumping',
          confidence: 89,
          possibleRisk: 'Environmental contamination',
          suggestedCategory: 'Municipal Sanitation',
          suggestedDepartment: 'Municipal Sanitation',
          isFallback: false,
          whyReasons: ['Residential park perimeter', 'Clearance required for pedestrian safety']
        }
      },
      // 6. Streetlight Blackout & Safety Concern
      {
        title: 'Dark Stretch - 6 Broken Streetlights on Hospital Road',
        description: 'Complete blackout along 400m stretch outside Metro Childrens Hospital. Multiple broken fixtures and hanging cables.',
        images: [streetlightBefore],
        location: 'Hospital Link Road, West Gate',
        coordinates: { lat: 12.9690, lng: 77.5875 },
        category: 'Electrical & Lighting',
        department: 'Electrical & Lighting Authority',
        assignedDepartment: 'Electrical & Lighting Authority',
        severity: 'High',
        publicImpact: 'High',
        summary: 'Multi-pole blackout causing severe night-time visibility drop and safety hazards outside pediatric medical facility.',
        keywords: ['streetlight', 'dark', 'blackout', 'hospital', 'wire'],
        priorityScore: 78,
        priorityLevel: 'HIGH',
        impactFactors: { severity: 32, publicExposure: 20, reportFrequency: 12, locationImportance: 10, recency: 4 },
        status: 'AWAITING_VERIFICATION',
        reportedBy: citizenAlex._id,
        reporterName: 'Alex Rivera',
        relatedReportsCount: 4,
        resolutionProof: {
          image: streetlightAfter,
          notes: 'Installed high-output LED luminaires across poles #12 through #18. Wiring secured into tamper-proof junction box.',
          resolvedByName: 'Electrical Authority Tech Team',
          resolvedAt: new Date(Date.now() - 12000000)
        },
        verificationSummary: {
          totalVotes: 1,
          resolvedVotes: 1,
          partialVotes: 0,
          unresolvedVotes: 0,
          status: 'PENDING'
        },
        aiAnalysis: {
          detectedIssue: 'Arterial Streetlight Blackout',
          confidence: 92,
          possibleRisk: 'Pedestrian assault risk, night-time vehicle crashes near emergency hospital intake',
          suggestedCategory: 'Electrical & Lighting',
          suggestedDepartment: 'Electrical & Lighting Authority',
          isFallback: false,
          whyReasons: ['Hospital emergency zone proximity (10/10)', 'Complete illumination outage']
        }
      },
      // 7. Clogged Storm Drain Overflow
      {
        title: 'Overflowing Storm Drain Flooding Ring Road Junction',
        description: 'Storm drain completely clogged with plastic and silt. Rainwater cannot escape, causing knee-deep waterlogging.',
        images: [drainBefore],
        location: 'Ring Road Junction, Near Flyover',
        coordinates: { lat: 12.9640, lng: 77.5920 },
        category: 'Water Supply & Drainage',
        department: 'Water Supply & Sewerage Board',
        assignedDepartment: 'Water Supply & Sewerage Board',
        severity: 'Critical',
        publicImpact: 'Severe',
        summary: 'Severe road junction inundation due to silt-choked drainage conduits.',
        keywords: ['drain', 'clogged', 'waterlogging', 'flooding', 'flyover'],
        priorityScore: 91,
        priorityLevel: 'URGENT',
        impactFactors: { severity: 36, publicExposure: 23, reportFrequency: 18, locationImportance: 9, recency: 5 },
        status: 'IN_PROGRESS',
        reportedBy: null,
        reporterName: 'Vikram Mehta',
        relatedReportsCount: 7,
        aiAnalysis: {
          detectedIssue: 'Urban Stormwater Drainage Failure',
          confidence: 95,
          possibleRisk: 'Vehicular stalling, emergency response delays, manhole submersion risk',
          suggestedCategory: 'Water Supply & Drainage',
          suggestedDepartment: 'Water Supply & Sewerage Board',
          isFallback: false,
          whyReasons: ['Direct gridlock impact on municipal ring road', 'Flash flood hazard']
        }
      },
      // 8. Traffic Signal Failure
      {
        title: 'Malfunctioning Traffic Signal at South Circle',
        description: 'Traffic signals blinking erratically on all four approaches. Major crossway gridlock with no traffic wardens present.',
        images: [],
        location: 'South Circle Intersection',
        coordinates: { lat: 12.9600, lng: 77.5980 },
        category: 'Traffic & Transport',
        department: 'Traffic Police & Transport Dept',
        assignedDepartment: 'Traffic Police & Transport Dept',
        severity: 'High',
        publicImpact: 'High',
        summary: 'Intersection signal synchronization failure resulting in quad-directional bottleneck.',
        keywords: ['signal', 'traffic', 'intersection', 'gridlock', 'malfunction'],
        priorityScore: 76,
        priorityLevel: 'HIGH',
        impactFactors: { severity: 28, publicExposure: 22, reportFrequency: 13, locationImportance: 8, recency: 5 },
        status: 'AI_CLASSIFIED',
        reportedBy: null,
        reporterName: 'Kavita Rao',
        relatedReportsCount: 3,
        aiAnalysis: {
          detectedIssue: 'Traffic Signal Controller Defect',
          confidence: 90,
          possibleRisk: 'Intersection t-bone collisions, multi-kilometer backup',
          suggestedCategory: 'Traffic & Transport',
          suggestedDepartment: 'Traffic Police & Transport Dept',
          isFallback: false,
          whyReasons: ['High peak-hour throughput intersection', 'Risk of blind-spot collisions']
        }
      },
      // 9. Damaged Median Divider
      {
        title: 'Broken Concrete Median Barrier Spilling on Expressway',
        description: 'Concrete median knocked out by heavy vehicle crash, blocking 1 inner lane on eastbound corridor.',
        images: [],
        location: 'Eastbound Expressway, Mile 4',
        coordinates: { lat: 12.9820, lng: 77.6050 },
        category: 'Public Safety & Infrastructure',
        department: 'City Infrastructure & Public Safety',
        assignedDepartment: 'City Infrastructure & Public Safety',
        severity: 'High',
        publicImpact: 'High',
        summary: 'Fragmented concrete debris obstructing high-speed expressway passing lane.',
        keywords: ['median', 'barrier', 'expressway', 'debris', 'concrete'],
        priorityScore: 81,
        priorityLevel: 'HIGH',
        impactFactors: { severity: 33, publicExposure: 23, reportFrequency: 12, locationImportance: 8, recency: 5 },
        status: 'ASSIGNED',
        reportedBy: null,
        reporterName: 'Sanjay Deshmukh',
        relatedReportsCount: 4,
        aiAnalysis: {
          detectedIssue: 'Highway Concrete Barrier Rupture',
          confidence: 91,
          possibleRisk: 'Secondary high-speed collisions with roadway rubble',
          suggestedCategory: 'Public Safety & Infrastructure',
          suggestedDepartment: 'City Infrastructure & Public Safety',
          isFallback: false,
          whyReasons: ['High-speed expressway zone', 'Active lane obstruction']
        }
      },
      // 10. Broken Public Footpath / Pavement Slabs
      {
        title: 'Dislodged Footpath Pavement Slabs Near Senior Center',
        description: 'Paving stones cracked and flipped up. Several elderly citizens have stumbled.',
        images: [],
        location: 'Elderly Community Centre, 2nd Cross',
        coordinates: { lat: 12.9760, lng: 77.5850 },
        category: 'Road Infrastructure',
        department: 'Public Works',
        assignedDepartment: 'Public Works',
        severity: 'Medium',
        publicImpact: 'Medium',
        summary: 'Uneven pedestrian pavement posing fall hazard to vulnerable residents.',
        keywords: ['footpath', 'pavement', 'senior center', 'trip hazard'],
        priorityScore: 62,
        priorityLevel: 'MEDIUM',
        impactFactors: { severity: 22, publicExposure: 16, reportFrequency: 10, locationImportance: 9, recency: 5 },
        status: 'REPORTED',
        reportedBy: citizenAlex._id,
        reporterName: 'Alex Rivera',
        relatedReportsCount: 2,
        aiAnalysis: {
          detectedIssue: 'Pedestrian Footpath Disrepair',
          confidence: 87,
          possibleRisk: 'Elderly fall and fracture risk',
          suggestedCategory: 'Road Infrastructure',
          suggestedDepartment: 'Public Works',
          isFallback: false,
          whyReasons: ['Proximity to Senior Community Center', 'Direct tripping hazard']
        }
      },
      // 11. Low Priority Street Sign Graffitied
      {
        title: 'Faded and Defaced Street Signboard',
        description: 'Directional sign for 7th Avenue covered in graffiti stickers and faded by sun.',
        images: [],
        location: '7th Avenue Corner',
        coordinates: { lat: 12.9810, lng: 77.5790 },
        category: 'Traffic & Transport',
        department: 'Traffic Police & Transport Dept',
        assignedDepartment: 'Traffic Police & Transport Dept',
        severity: 'Low',
        publicImpact: 'Low',
        summary: 'Non-critical legibility issue on secondary street signage.',
        keywords: ['signboard', 'graffiti', 'direction'],
        priorityScore: 32,
        priorityLevel: 'LOW',
        impactFactors: { severity: 10, publicExposure: 10, reportFrequency: 4, locationImportance: 5, recency: 3 },
        status: 'REPORTED',
        reportedBy: null,
        reporterName: 'Rohan Gupta',
        relatedReportsCount: 1,
        aiAnalysis: {
          detectedIssue: 'Signage Defacement',
          confidence: 85,
          possibleRisk: 'Minor motorist navigational confusion',
          suggestedCategory: 'Traffic & Transport',
          suggestedDepartment: 'Traffic Police & Transport Dept',
          isFallback: false,
          whyReasons: ['Low traffic volume street', 'Zero direct collision risk']
        }
      },
      // 12. Low Priority Overgrown Shrub Obscuring Sidewalk
      {
        title: 'Overgrown Shrub Encroaching on Sidewalk',
        description: 'Private hedges have overgrown the public pathway forcing pedestrians to step down.',
        images: [],
        location: 'Maple Wood Lane',
        coordinates: { lat: 12.9680, lng: 77.6100 },
        category: 'Public Safety & Infrastructure',
        department: 'City Infrastructure & Public Safety',
        assignedDepartment: 'City Infrastructure & Public Safety',
        severity: 'Low',
        publicImpact: 'Low',
        summary: 'Hedge trimming required along quiet residential sidewalk.',
        keywords: ['shrub', 'sidewalk', 'overgrown'],
        priorityScore: 36,
        priorityLevel: 'LOW',
        impactFactors: { severity: 12, publicExposure: 11, reportFrequency: 5, locationImportance: 4, recency: 4 },
        status: 'AI_CLASSIFIED',
        reportedBy: null,
        reporterName: 'Maya Sen',
        relatedReportsCount: 1,
        aiAnalysis: {
          detectedIssue: 'Pathway Shrub Encroachment',
          confidence: 86,
          possibleRisk: 'Minor pedestrian detour',
          suggestedCategory: 'Public Safety & Infrastructure',
          suggestedDepartment: 'City Infrastructure & Public Safety',
          isFallback: false,
          whyReasons: ['Low density residential road', 'Cosmetic and comfort issue']
        }
      },
      // 13. Additional cluster report for Cluster 1 (Main Road Pothole)
      {
        title: 'Damaged Tyre from Deep Pothole Near College',
        description: 'My scooter wheel rim bent when I hit the hidden pothole outside the college entrance in the rain.',
        images: [potholeBefore],
        location: 'College Gate, 50m North',
        coordinates: { lat: 12.9737, lng: 77.5965 },
        category: 'Road Infrastructure',
        department: 'Public Works',
        assignedDepartment: 'Public Works',
        severity: 'High',
        publicImpact: 'High',
        summary: 'Two-wheeler rim damage reported from deep unlit pothole.',
        keywords: ['pothole', 'tyre damage', 'college gate', 'scooter'],
        priorityScore: 92,
        priorityLevel: 'URGENT',
        impactFactors: { severity: 36, publicExposure: 23, reportFrequency: 19, locationImportance: 9, recency: 5 },
        status: 'IN_PROGRESS',
        reportedBy: null,
        reporterName: 'Aditya Varma',
        duplicateGroupId: cluster1._id,
        relatedReportsCount: 8,
        aiAnalysis: {
          detectedIssue: 'Road Pothole Impact Damage',
          confidence: 93,
          possibleRisk: 'Vehicle rim breakage, rider skidding',
          suggestedCategory: 'Road Infrastructure',
          suggestedDepartment: 'Public Works',
          isFallback: false,
          whyReasons: ['Corroborates active College Gate cluster', 'Property damage documented']
        }
      },
      // 14. Additional cluster report for Cluster 2 (Central Market Garbage)
      {
        title: 'Waste Overflow Spilling Near Produce Vendors',
        description: 'Vegetable sellers are complaining of foul smell and rodents due to uncollected waste bins for past 3 days.',
        images: [garbageBefore],
        location: 'Commercial Market St, South Alley',
        coordinates: { lat: 12.9789, lng: 77.5925 },
        category: 'Municipal Sanitation',
        department: 'Municipal Sanitation',
        assignedDepartment: 'Municipal Sanitation',
        severity: 'High',
        publicImpact: 'High',
        summary: 'Commercial produce market food safety concern from uncollected organic waste.',
        keywords: ['garbage', 'market', 'vendors', 'rats', 'sanitation'],
        priorityScore: 80,
        priorityLevel: 'HIGH',
        impactFactors: { severity: 29, publicExposure: 20, reportFrequency: 16, locationImportance: 8, recency: 5 },
        status: 'IN_PROGRESS',
        reportedBy: null,
        reporterName: 'Sunita Patel',
        duplicateGroupId: cluster2._id,
        relatedReportsCount: 5,
        aiAnalysis: {
          detectedIssue: 'Commercial Organic Waste Spillage',
          confidence: 90,
          possibleRisk: 'Food contamination and health inspection failure',
          suggestedCategory: 'Municipal Sanitation',
          suggestedDepartment: 'Municipal Sanitation',
          isFallback: false,
          whyReasons: ['Food distribution hygiene hazard', 'Active Cluster corroboration']
        }
      }
    ];

    const createdComplaints = await Complaint.insertMany(complaintsData);

    // Link lead complaint back to clusters
    cluster1.leadComplaintId = createdComplaints[0]._id;
    cluster1.complaintIds = [createdComplaints[0]._id, createdComplaints[12]._id];
    await cluster1.save();

    cluster2.leadComplaintId = createdComplaints[3]._id;
    cluster2.complaintIds = [createdComplaints[3]._id, createdComplaints[13]._id];
    await cluster2.save();

    cluster3.leadComplaintId = createdComplaints[2]._id;
    cluster3.complaintIds = [createdComplaints[2]._id];
    await cluster3.save();

    console.log('Seeding Status Timelines for demo complaint #1...');
    const demoIssue = createdComplaints[0];
    const now = Date.now();

    await StatusHistory.create([
      {
        complaintId: demoIssue._id,
        status: 'REPORTED',
        stageTitle: 'Citizen Report Filed',
        comment: 'Initial photo and geolocation observation submitted by Alex Rivera.',
        icon: 'MapPin',
        updaterName: 'Alex Rivera',
        timestamp: new Date(now - 3600000 * 5)
      },
      {
        complaintId: demoIssue._id,
        status: 'AI_CLASSIFIED',
        stageTitle: 'AI Vision & Impact Classified',
        comment: 'Computer vision detected severe asphalt crater (94% confidence). Categorized as Road Infrastructure.',
        icon: 'Bot',
        updaterName: 'Civic Lens AI Core',
        timestamp: new Date(now - 3600000 * 4.9)
      },
      {
        complaintId: demoIssue._id,
        status: 'CLUSTER_LINKED',
        stageTitle: '8 Similar Reports Clustered',
        comment: 'Spatial similarity matched 7 other citizen reports within 150m. Boosted Impact Score to 94/100.',
        icon: 'Network',
        updaterName: 'Civic Lens Duplicate Engine',
        timestamp: new Date(now - 3600000 * 4.8)
      },
      {
        complaintId: demoIssue._id,
        status: 'PRIORITIZED',
        stageTitle: 'Priority: URGENT (94/100)',
        comment: 'Escalated to top of Municipal Operations Queue due to heavy student commuter exposure.',
        icon: 'Zap',
        updaterName: 'Civic Impact Scoring Core',
        timestamp: new Date(now - 3600000 * 4.7)
      },
      {
        complaintId: demoIssue._id,
        status: 'ASSIGNED',
        stageTitle: 'Assigned to Public Works Department',
        comment: 'Dispatched to Zone 3 Road Maintenance Unit for high-priority asphalt leveling.',
        icon: 'Building',
        updaterName: 'Sarah Jenkins (Operations Chief)',
        timestamp: new Date(now - 3600000 * 3)
      },
      {
        complaintId: demoIssue._id,
        status: 'IN_PROGRESS',
        stageTitle: 'Work In Progress — Heavy Machinery Deployed',
        comment: 'Road crew deployed with asphalt cutter and compaction roller.',
        icon: 'Wrench',
        updaterName: 'Public Works Field Crew #4',
        timestamp: new Date(now - 3600000 * 1)
      }
    ]);

    console.log('Seeding verification for resolved issue #2...');
    await Verification.create({
      complaintId: createdComplaints[1]._id,
      userId: citizenAlex._id,
      userName: 'Alex Rivera',
      result: 'RESOLVED',
      comment: 'Inspected the resurfaced trench this morning. Perfectly smooth and vehicles no longer swerve!',
      pointsAwarded: 5,
      timestamp: new Date(now - 43200000)
    });

    console.log('Seeding notifications...');
    await Notification.create([
      {
        userId: citizenAlex._id,
        complaintId: demoIssue._id,
        title: 'Status Update: Field Crew Dispatched',
        message: 'Your report "Huge Pothole Outside University Gate" is now marked IN PROGRESS by Public Works.',
        type: 'STATUS_CHANGED',
        createdAt: new Date(now - 3600000)
      },
      {
        userId: citizenAlex._id,
        complaintId: createdComplaints[5]._id,
        title: 'Action Needed: Is this issue resolved?',
        message: 'Electrical Authority marked Hospital Road streetlights as fixed. Please inspect and confirm!',
        type: 'VERIFICATION_REQUESTED',
        createdAt: new Date(now - 7200000)
      },
      {
        userId: null,
        complaintId: demoIssue._id,
        title: '⚠ Urgent Civic Issue Escalation',
        message: 'College Gate pothole crossed 90+ impact threshold. Prioritized in Municipal Command Queue.',
        type: 'EMERGENCY_ESCALATION',
        createdAt: new Date(now - 14400000)
      }
    ]);

    console.log('=======================================================');
    console.log('✓ CIVIC LENS AI DATABASE SEEDED SUCCESSFULLY!');
    console.log(`✓ Users created: Citizen Alex Rivera & Admin Sarah Jenkins`);
    console.log(`✓ Complaints seeded: ${createdComplaints.length}`);
    console.log(`✓ Issue Clusters: 3 active clusters`);
    console.log(`✓ Ready for Live Demo walkthrough!`);
    console.log('=======================================================');

    return true;
  } catch (error) {
    console.error('Database seeding failed:', error);
    throw error;
  }
}

// Run standalone if executed via node seed.js
if (require.main === module) {
  seedDatabase().then(() => {
    process.exit(0);
  }).catch(() => {
    process.exit(1);
  });
}

module.exports = seedDatabase;

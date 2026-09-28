import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize Gemini AI client
  const geminiApiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (geminiApiKey) {
    ai = new GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // System instruction for Kerala Voyage AI Assistant
  const KERALA_VOYAGE_SYSTEM_PROMPT = `
You are the intelligent AI Assistant & Tour Consultant Co-pilot for "Kerala Voyage Tours & Travels", a premier destination management and tour agency based in Kochi, Kerala ("God's Own Country").

Your role is to empower travel agency staff (Admins, Sales Consultants, Operations managers) with instant, accurate, warm, and highly professional assistance:
1. Provide deep Kerala travel knowledge:
   - Top destinations: Munnar (tea plantations, Eravikulam, Mattupetty), Thekkady (Periyar wildlife reserve, spice plantations, bamboo rafting), Alleppey (backwaters, deluxe/premium houseboats, shikara rides), Kumarakom (bird sanctuary, luxury lake resorts), Kovalam & Varkala (cliffs, beaches, lighthouse), Wayanad (Chembra peak, Edakkal caves, waterfalls, treehouses), Fort Kochi (Chinese fishing nets, spice market, Jew town, Mattancherry Palace), Athirappilly (waterfalls), Poovar (golden sand island & mangroves).
   - Driving distance & realistic logistics:
     * Cochin Airport (COK) to Munnar: ~130 km (3.5 - 4 hours scenic drive)
     * Munnar to Thekkady: ~90 km (3 hours hill drive via spice plantations)
     * Thekkady to Alleppey: ~140 km (3.5 - 4 hours downhill to backwaters)
     * Alleppey to Kovalam: ~160 km (4 hours)
     * Alleppey to Cochin Airport: ~85 km (2 hours)
   - Vehicle fleets: Sedan (Etios/Dzire for 2-3 pax), Innova Crysta (4-6 pax), 12/17-seater Tempo Traveller for groups.
   - Houseboat policies: Check-in 12:00 PM with welcome drink, cruising through Vembanad backwaters, lunch (Kerala sadya/pearl spot karimeen fry), tea/snacks, anchor at 5:30 PM (government rule), dinner & overnight stay, check-out at 9:00 AM after breakfast.
   - Seasons: Peak season (Oct-March), Monsoon Ayurveda season (June-August), Summer (April-May).
2. Assist with Agency Workflow:
   - Suggesting customized Day-wise itineraries with pacing (relaxed vs active).
   - Recommending quotation pricing based on season, hotel categories (3-Star Deluxe, 4-Star Premium, 5-Star Luxury/Heritage), vehicle type.
   - Drafting tailored, polite, conversion-optimized WhatsApp messages (Enquiry Reply, Itinerary Quote, Advance Payment Reminder, Voucher Confirmation, Welcome to Kerala greeting).
   - Answering questions about lead status progression, sales objections, and operational arrangements.

Tone: Warm, hospitable (the Kerala spirit of "Athithi Devo Bhava"), crisp, structured, using bullet points, emojis, and clear actionable recommendations.
`;

  // API Route: AI Assistant Chat
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { message, history, contextData } = req.body;

      if (!message || typeof message !== 'string') {
        res.status(400).json({ error: 'Message is required' });
        return;
      }

      // If Gemini client is available, call the API
      if (ai) {
        try {
          const contents: any[] = [];

          // Add past messages if provided
          if (Array.isArray(history) && history.length > 0) {
            for (const h of history.slice(-8)) {
              contents.push({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.content }],
              });
            }
          }

          // Build current user prompt with optional agency context
          let prompt = message;
          if (contextData) {
            prompt = `[CURRENT AGENCY CONTEXT: ${JSON.stringify(contextData)}]\n\nUser Question: ${message}`;
          }

          contents.push({
            role: 'user',
            parts: [{ text: prompt }],
          });

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents,
            config: {
              systemInstruction: KERALA_VOYAGE_SYSTEM_PROMPT,
              temperature: 0.7,
            },
          });

          const replyText = response.text || "I'm ready to assist you with Kerala travel planning and agency operations.";
          res.json({ reply: replyText });
          return;
        } catch (apiErr: any) {
          console.warn('Gemini API call failed, using intelligent Kerala fallback:', apiErr.message);
          // Fall through to fallback
        }
      }

      // Fallback domain-aware assistant response when API key is unavailable or fails
      const fallbackReply = generateKeralaDomainFallback(message, contextData);
      res.json({ reply: fallbackReply });
    } catch (error: any) {
      console.error('Chat endpoint error:', error);
      res.status(500).json({
        error: 'Failed to process chat message',
        details: error?.message || 'Unknown error',
      });
    }
  });

  // API Route: Quick Itinerary Generator
  app.post('/api/ai/generate-itinerary', async (req: Request, res: Response) => {
    try {
      const { destination, durationDays, budget, travelerType, pace, preferences } = req.body;
      const days = Number(durationDays) || 5;

      if (ai) {
        try {
          const prompt = `Generate a detailed day-wise Kerala tour itinerary for:
- Destination/Circuit: ${destination || 'Classic Kerala (Munnar - Thekkady - Alleppey - Cochin)'}
- Duration: ${days} Days / ${days - 1} Nights
- Traveler Type: ${travelerType || 'Couple / Honeymoon'}
- Budget Category: ${budget || 'Moderate/Premium'}
- Pace: ${pace || 'Balanced'}
- Specific Interests: ${preferences || 'Scenic tea hills, wildlife sanctuary, private houseboat cruise, authentic Kerala cuisine'}

Format each day cleanly with:
Day [Number]: [Title/City]
- Morning: Activities & Transfers (include travel times)
- Afternoon: Sightseeing / Relaxation
- Evening: Cultural experience or sunset point
- Recommended Stay / Hotel Category & Meal plan
- Kerala Special Tip for consultants
`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: KERALA_VOYAGE_SYSTEM_PROMPT,
              temperature: 0.6,
            },
          });

          res.json({ itinerary: response.text });
          return;
        } catch (err: any) {
          console.warn('AI itinerary generation fallback:', err.message);
        }
      }

      // Fallback Itinerary
      const fallback = generateFallbackItinerary(destination, days, travelerType);
      res.json({ itinerary: fallback });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to generate itinerary' });
    }
  });

  // API Route: Draft WhatsApp Message
  app.post('/api/ai/draft-whatsapp', async (req: Request, res: Response) => {
    try {
      const { type, customerName, destination, days, amount, hotel, details } = req.body;

      if (ai) {
        try {
          const prompt = `Draft a polite, engaging, and professional WhatsApp message for a Kerala travel client.
Template Type: ${type} (e.g. Enquiry Acknowledgement, Quotation Send, Booking Confirmation, Payment Voucher, Travel Reminder)
Customer Name: ${customerName || 'Valued Guest'}
Destination / Package: ${destination || 'Kerala Serenity Tour'}
Duration: ${days || 5} Days
Quotation/Booking Amount: ₹${amount || '35,000'}
Accommodations/Highlights: ${hotel || 'Munnar 4-Star Resort + Deluxe Alleppey Houseboat'}
Extra details: ${details || 'Includes AC Sedan, breakfast, houseboat all meals, sightseeing entry assistance'}

Make it ready to copy and send via WhatsApp with appropriate emojis, bullet points, and a warm sign-off from "Kerala Voyage Tours & Travels Team (+91 98470 12345)". Keep it concise and formatted for mobile screens.`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: KERALA_VOYAGE_SYSTEM_PROMPT,
              temperature: 0.5,
            },
          });

          res.json({ message: response.text });
          return;
        } catch (err: any) {
          console.warn('WhatsApp draft fallback:', err.message);
        }
      }

      const fallbackMsg = `Namaskaram ${customerName || 'Guest'}! 🙏✨\n\nGreetings from *Kerala Voyage Tours & Travels*!\n\nWe have prepared your personalized *${destination || 'Kerala Special'}* tour plan (${days || 5} Days). Packages include premium stays, private chauffeur-driven vehicle, and backwater cruise.\n\nTotal Estimated Amount: ₹${amount || '35,000'}\n\nPlease review your day-wise plan and let us know if you'd like any custom modifications. We are delighted to host you in God's Own Country!\n\nWarm regards,\n*Kerala Voyage Team*\n📞 +91 98470 12345`;
      res.json({ message: fallbackMsg });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to draft message' });
    }
  });

  // Vite or static files middleware
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

// Fallback generator for Kerala Travel queries
function generateKeralaDomainFallback(query: string, context?: any): string {
  const q = query.toLowerCase();

  if (q.includes('itinerary') || q.includes('plan') || q.includes('days')) {
    return `🌴 **Recommended Kerala Itinerary Plan (5 Days / 4 Nights Classic Circuit):**\n\n` +
      `• **Day 1: Arrival in Cochin ➔ Munnar**\n  - Chauffeur pickup at Cochin (COK) Airport/Station.\n  - Scenic drive past Cheeyappara & Valara waterfalls.\n  - Check-in at tea garden resort, evening stroll.\n\n` +
      `• **Day 2: Munnar Sightseeing**\n  - Morning visit to Eravikulam National Park (Nilgiri Tahr).\n  - Mattupetty Dam, Echo Point, Tea Museum & Kundala Lake.\n\n` +
      `• **Day 3: Munnar ➔ Thekkady (Periyar)**\n  - 3-hour hill drive through cardamom & pepper plantations.\n  - Periyar Lake boat safari, Spice plantation tour, evening Kathakali & Kalaripayattu martial arts show.\n\n` +
      `• **Day 4: Thekkady ➔ Alleppey Backwaters**\n  - Board traditional thatched Houseboat at 12:00 PM.\n  - Cruising Vembanad lake & narrow canals. Authentic Kerala lunch (Karimeen fish fry/veg sadya).\n  - Overnight stay amidst tranquil backwaters.\n\n` +
      `• **Day 5: Alleppey ➔ Cochin Departure**\n  - Morning checkout after breakfast. Sightseeing Fort Kochi (Chinese nets, Jew Town) before drop-off at Cochin Airport.\n\n💡 *Tip:* For families or senior citizens, keep driving intervals capped at 3.5 hours and book private Innova Crysta.`;
  }

  if (q.includes('whatsapp') || q.includes('quote') || q.includes('message')) {
    return `📲 **Kerala Quotation WhatsApp Template:**\n\n` +
      `*Namaskaram from Kerala Voyage!* 🙏🌴\n\n` +
      `Thank you for reaching out to us regarding your upcoming trip to God's Own Country!\n\n` +
      `✨ *Package Highlights:*\n` +
      `• 3 Nights Munnar (Misty Valley 4★ Resort)\n` +
      `• 1 Night Alleppey (Deluxe Backwater Houseboat)\n` +
      `• Private AC Chauffeur Driven Vehicle\n` +
      `• Daily Breakfast & All Meals on Houseboat\n\n` +
      `💰 *Special Agency Quote:* ₹34,500 (All Inclusive for 2 Adults)\n\n` +
      `Would you like to lock this reservation or make any adjustments to the hotels? We are here to assist!`;
  }

  if (q.includes('lead') || q.includes('pipeline') || q.includes('conversion') || q.includes('sales')) {
    return `📈 **Lead Management & Conversion Best Practices for Kerala Agency:**\n\n` +
      `1. **Speed to First Call:** Contact leads within 15 minutes of enquiry arrival (increases conversion by 65%).\n` +
      `2. **Discovery Checklist:** Always clarify total Adults + Kids, preferred dates, arrival airport (COK or TRV), budget band, and vehicle preference.\n` +
      `3. **Quotation Follow-up:** Schedule the next touchpoint within 24 hours with an appealing itinerary PDF/WhatsApp summary.\n` +
      `4. **Peak Season Advisory:** Alert clients early about Munnar & Houseboat sold-out dates during Diwali, Christmas-New Year, and school holidays.`;
  }

  if (q.includes('hotel') || q.includes('houseboat') || q.includes('resort')) {
    return `🏨 **Kerala Accommodation Quick Reference:**\n\n` +
      `• **Munnar:** Blanket Luxury Villa, Tea County, Fragrant Nature, Amber Dale.\n` +
      `• **Thekkady:** Spice Village, Elephant Court, Greenwoods Resort.\n` +
      `• **Alleppey Houseboats:** 1-Bedroom to 5-Bedroom Deluxe/Premium with AC from 9 PM to 6 AM (or 24h Full-Time AC in Premium/Luxury).\n` +
      `• **Kovalam / Varkala:** The Leela Kovalam, Uday Samudra, Gateway Cliff Varkala.\n` +
      `• **Wayanad:** Vythiri Resort (Tree houses), Windflower, Morickap.`;
  }

  return `🙏 **Namaskaram! I am your Kerala Voyage AI Co-pilot.**\n\nI can help you with:\n` +
    `• **Custom Itineraries:** Quick day-by-day plans for Munnar, Thekkady, Alleppey, Wayanad, Kovalam, etc.\n` +
    `• **WhatsApp Communications:** Instant draft quotes, booking vouchers, and follow-up templates.\n` +
    `• **Pricing & Quotations:** Tariff estimates, vehicle requirements (Etios vs Innova Crysta), and meal plans.\n` +
    `• **Lead & Booking Help:** Guidance on converting inquiries and managing operations.\n\n` +
    `How can I assist your team right now?`;
}

function generateFallbackItinerary(destination: string, days: number, travelerType: string): string {
  return `🌴 **${days}-Day Tailored Kerala Itinerary (${destination || 'Classic Kerala'})**\n` +
    `👤 Target: ${travelerType || 'General Travelers'}\n\n` +
    Array.from({ length: days }, (_, i) => {
      const dayNum = i + 1;
      if (dayNum === 1) {
        return `📅 **Day 1: Arrival & Gateway to the Hills**\n- Chauffeur pickup at Cochin International Airport (COK).\n- Enroute sightseeing at Cheeyappara and Valara waterfalls.\n- Scenic drive through spice hills to Munnar. Hotel check-in and evening at leisure.`;
      } else if (dayNum === 2) {
        return `📅 **Day 2: Tea Trails & Nilgiri Heights**\n- Morning excursion to Eravikulam National Park to spot the Nilgiri Tahr.\n- Afternoon visit to Mattupetty Dam, Echo Point, and Tea Museum.\n- Sunset boating at Kundala Lake.`;
      } else if (dayNum === 3 && days >= 4) {
        return `📅 **Day 3: Spice Country of Thekkady (Periyar)**\n- Check-out and transfer to Thekkady via Anakkara spice valley.\n- Guided spice plantation walk (cardamom, pepper, cinnamon).\n- Evening traditional Kalaripayattu martial arts show & Ayurveda rejuvenation massage.`;
      } else if (dayNum === days - 1 || (dayNum === 3 && days === 3)) {
        return `📅 **Day ${dayNum}: Backwaters & Houseboat Serenity (Alleppey)**\n- Check-in to traditional Kettuvallam Houseboat at Punnamada Jetty by 12:00 PM.\n- Cruise through narrow village canals, paddy fields, and Vembanad Lake.\n- Authentic Kerala Sadya with fresh Karimeen fish for lunch, overnight stay on water.`;
      } else if (dayNum === days) {
        return `📅 **Day ${dayNum}: Heritage Fort Kochi & Departure**\n- Morning cruise and breakfast on houseboat, check-out at 9:00 AM.\n- Visit Fort Kochi Chinese Fishing Nets, St. Francis Church, and Jew Town.\n- Chauffeur drop-off at Cochin Airport for onward journey with fond memories.`;
      } else {
        return `📅 **Day ${dayNum}: Scenic Exploration & Leisure**\n- Local village experience, artisanal handicraft shopping, and beachside relaxation.\n- Dinner at traditional coastal restaurant.`;
      }
    }).join('\n\n');
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

-- =============================================================================
-- PUBLIMARCA STUDIO — ESQUEMA COMPLETO DE BASE DE DATOS SUPABASE + SEED INICIAL
-- Instrucciones:
--   1. Abre tu proyecto en https://supabase.com/dashboard
--   2. Ve a "SQL Editor" en el menú lateral izquierdo y haz clic en "New query"
--   3. Pega todo el contenido de este archivo y haz clic en "Run" (Ejecutar).
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. CONFIGURACIÓN GENERAL Y VISIBILIDAD DE SECCIONES (site_settings)
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id text primary key default 'default',
  section_visibility jsonb not null default '{
    "hero_video": true,
    "client_logos": true,
    "manifesto": true,
    "services": true,
    "industries": true,
    "projects": true,
    "process": true,
    "testimonials": true
  }'::jsonb,
  hero_video_url text not null default '/video_hero_publimarca.mp4',
  hero_live_badge_es text not null default 'Set en Vivo • Cámara A',
  hero_live_badge_en text not null default 'Live Stage • A-Cam Roll',
  hero_subheadline_es text not null default 'Atelier creativo independiente que opera en el punto exacto entre la gravedad cultural del Caribe y la precisión editorial global. Diseñamos narrativas cinematográficas, estética espacial e identidades gráficas inmutables.',
  hero_subheadline_en text not null default 'Independent creative atelier operating at the precise friction point between Caribbean cultural gravity and global editorial precision. We engineer cinematic narratives, spatial aesthetics, and immutable graphic identities.',
  manifesto_quote_es text not null default '«No somos una agencia de plantillas. Somos un santuario de oficio, valentía estratégica y narrativa visual de alto impacto construido desde la médula cultural de la República Dominicana.»',
  manifesto_quote_en text not null default '“Not an agency of templates. A sanctuary of craft, strategic courage, and high-impact visual storytelling built from the cultural marrow of the Dominican Republic.”',
  contact_address_es text not null default 'Higüey, La Altagracia, República Dominicana',
  contact_address_en text not null default 'Higüey, La Altagracia, Dominican Republic',
  contact_email text not null default 'dispatch@publimarca.do',
  contact_phone text not null default '+1 (809) 554-2040',
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 2. VIDEOS DEL HERO (Secuencia de reproducción y slider horizontal)
-- -----------------------------------------------------------------------------
create table if not exists public.hero_videos (
  id text primary key,
  sort_order int not null default 1,
  url text not null,
  title_es text not null default 'Reel de Estudio',
  title_en text not null default 'Studio Reel',
  badge_es text not null default 'Set en Vivo • Cámara A',
  badge_en text not null default 'Live Stage • A-Cam Roll',
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 3. BARRA DE LOGOS DE CLIENTES (Cinta desplazable inferior del Hero)
-- -----------------------------------------------------------------------------
create table if not exists public.client_brands (
  id text primary key,
  sort_order int not null default 1,
  slug text not null,
  name text not null,
  logo_url text not null,
  instagram_url text not null default '#',
  size text not null default 'standard',
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 4. DIRECTORIO DE SERVICIOS (Enfoque Disciplinario)
-- -----------------------------------------------------------------------------
create table if not exists public.services (
  id text primary key,
  sort_order int not null default 1,
  number_label text not null,
  title_es text not null,
  title_en text not null,
  tags_es text not null,
  tags_en text not null,
  description_es text not null,
  description_en text not null,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 5. SOLUCIONES PARA CADA INDUSTRIA (industries)
-- -----------------------------------------------------------------------------
create table if not exists public.industries (
  id text primary key,
  sort_order int not null default 1,
  number_label text not null,
  title_es text not null,
  title_en text not null,
  desc_es text not null,
  desc_en text not null,
  tag_es text not null default '',
  tag_en text not null default '',
  sub_es text not null default '',
  sub_en text not null default '',
  image_url text not null,
  layout text not null default 'vertical-light',
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 6. CATÁLOGO EDITABLE DE TAGS DE PROYECTOS (project_tags)
-- Permite crear, renombrar o eliminar los tags de filtrado del portafolio
-- -----------------------------------------------------------------------------
create table if not exists public.project_tags (
  id text primary key,
  sort_order int not null default 1,
  slug text unique not null,
  label_es text not null,
  label_en text not null,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 7. PROYECTOS SELECCIONADOS (Portafolio filtrable por project_tags)
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id text primary key,
  sort_order int not null default 1,
  featured boolean not null default false,
  categories text[] not null default array['identity'],
  image_url text not null,
  badge_es text not null,
  badge_en text not null,
  client_es text not null,
  client_en text not null,
  meta_es text not null,
  meta_en text not null,
  title_es text not null,
  title_en text not null,
  summary_es text not null,
  summary_en text not null,
  specs_es text not null,
  specs_en text not null,
  location text not null default 'Higüey • RD',
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 8. NUESTRO PROTOCOLO (La Cadencia de Etapas)
-- -----------------------------------------------------------------------------
create table if not exists public.process_steps (
  id text primary key,
  sort_order int not null default 1,
  number_label text not null,
  icon text not null default 'psychology',
  title_es text not null,
  title_en text not null,
  desc_es text not null,
  desc_en text not null,
  deliverable_es text not null,
  deliverable_en text not null,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 9. COMENTARIOS / PERSPECTIVA EDITORIAL (Carrusel de tarjetas apiladas)
-- -----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id text primary key,
  sort_order int not null default 1,
  kicker_es text not null,
  kicker_en text not null,
  badge_es text not null,
  badge_en text not null,
  quote_es text not null,
  quote_en text not null,
  author_es text not null,
  author_en text not null,
  role_es text not null,
  role_en text not null,
  location text not null default 'Higüey • RD',
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 10. SOLICITUDES DE PROYECTOS / LEADS (Formulario de contacto)
-- -----------------------------------------------------------------------------
create table if not exists public.commissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  email text not null,
  phone text not null default '',
  capabilities text[] not null default array[]::text[],
  scope text not null,
  locale text not null default 'es',
  status text not null default 'nuevo' check (status in ('nuevo', 'en_revision', 'contactado', 'archivado')),
  created_at timestamptz not null default now()
);

-- -----------------------------------------------------------------------------
-- 11. SNAPSHOT GLOBAL CMS (Respaldo JSONB instantáneo)
-- -----------------------------------------------------------------------------
create table if not exists public.cms_state (
  id text primary key default 'default',
  section_visibility jsonb not null default '{}'::jsonb,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- =============================================================================
-- POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS)
-- =============================================================================
alter table public.site_settings enable row level security;
alter table public.hero_videos enable row level security;
alter table public.client_brands enable row level security;
alter table public.services enable row level security;
alter table public.industries enable row level security;
alter table public.project_tags enable row level security;
alter table public.projects enable row level security;
alter table public.process_steps enable row level security;
alter table public.testimonials enable row level security;
alter table public.commissions enable row level security;
alter table public.cms_state enable row level security;

drop policy if exists "Allow all site_settings" on public.site_settings;
create policy "Allow all site_settings" on public.site_settings for all using (true) with check (true);

drop policy if exists "Allow all hero_videos" on public.hero_videos;
create policy "Allow all hero_videos" on public.hero_videos for all using (true) with check (true);

drop policy if exists "Allow all client_brands" on public.client_brands;
create policy "Allow all client_brands" on public.client_brands for all using (true) with check (true);

drop policy if exists "Allow all services" on public.services;
create policy "Allow all services" on public.services for all using (true) with check (true);

drop policy if exists "Allow all industries" on public.industries;
create policy "Allow all industries" on public.industries for all using (true) with check (true);

drop policy if exists "Allow all project_tags" on public.project_tags;
create policy "Allow all project_tags" on public.project_tags for all using (true) with check (true);

drop policy if exists "Allow all projects" on public.projects;
create policy "Allow all projects" on public.projects for all using (true) with check (true);

drop policy if exists "Allow all process_steps" on public.process_steps;
create policy "Allow all process_steps" on public.process_steps for all using (true) with check (true);

drop policy if exists "Allow all testimonials" on public.testimonials;
create policy "Allow all testimonials" on public.testimonials for all using (true) with check (true);

drop policy if exists "Allow all commissions" on public.commissions;
create policy "Allow all commissions" on public.commissions for all using (true) with check (true);

drop policy if exists "Allow all cms_state" on public.cms_state;
create policy "Allow all cms_state" on public.cms_state for all using (true) with check (true);

-- =============================================================================
-- DATOS POR DEFECTO (SEED INICIAL CON TODA LA INFORMACIÓN DE LA PÁGINA)
-- =============================================================================

-- 1. Configuración General y Visibilidad
insert into public.site_settings (
  id, section_visibility, hero_video_url, hero_live_badge_es, hero_live_badge_en,
  hero_subheadline_es, hero_subheadline_en, manifesto_quote_es, manifesto_quote_en,
  contact_address_es, contact_address_en, contact_email, contact_phone
) values (
  'default',
  '{"hero_video":true,"client_logos":true,"manifesto":true,"services":true,"industries":true,"projects":true,"process":true,"testimonials":true}'::jsonb,
  '/video_hero_publimarca.mp4',
  'Set en Vivo • Cámara A',
  'Live Stage • A-Cam Roll',
  'Atelier creativo independiente que opera en el punto exacto entre la gravedad cultural del Caribe y la precisión editorial global. Diseñamos narrativas cinematográficas, estética espacial e identidades gráficas inmutables.',
  'Independent creative atelier operating at the precise friction point between Caribbean cultural gravity and global editorial precision. We engineer cinematic narratives, spatial aesthetics, and immutable graphic identities.',
  '«No somos una agencia de plantillas. Somos un santuario de oficio, valentía estratégica y narrativa visual de alto impacto construido desde la médula cultural de la República Dominicana.»',
  '“Not an agency of templates. A sanctuary of craft, strategic courage, and high-impact visual storytelling built from the cultural marrow of the Dominican Republic.”',
  'Higüey, La Altagracia, República Dominicana',
  'Higüey, La Altagracia, Dominican Republic',
  'dispatch@publimarca.do',
  '+1 (809) 554-2040'
) on conflict (id) do update set
  section_visibility = excluded.section_visibility,
  hero_video_url = excluded.hero_video_url,
  hero_live_badge_es = excluded.hero_live_badge_es,
  hero_live_badge_en = excluded.hero_live_badge_en,
  hero_subheadline_es = excluded.hero_subheadline_es,
  hero_subheadline_en = excluded.hero_subheadline_en,
  manifesto_quote_es = excluded.manifesto_quote_es,
  manifesto_quote_en = excluded.manifesto_quote_en,
  contact_address_es = excluded.contact_address_es,
  contact_address_en = excluded.contact_address_en,
  contact_email = excluded.contact_email,
  contact_phone = excluded.contact_phone,
  updated_at = now();

-- 2. Video del Hero por defecto
insert into public.hero_videos (id, sort_order, url, title_es, title_en, badge_es, badge_en)
values
  ('hv-1', 1, '/video_hero_publimarca.mp4', 'Showreel Principal Publimarca', 'Publimarca Main Showreel', 'Set en Vivo • Cámara A', 'Live Stage • A-Cam Roll')
on conflict (id) do update set
  sort_order = excluded.sort_order,
  url = excluded.url,
  title_es = excluded.title_es,
  title_en = excluded.title_en,
  badge_es = excluded.badge_es,
  badge_en = excluded.badge_en,
  updated_at = now();

-- 3. Barra de Logos por defecto
insert into public.client_brands (id, sort_order, slug, name, logo_url, instagram_url, size)
values
  ('cb-1', 1, 'agmotors', 'AGMOTORS', '/Logos/LOGO%20AGMOTORS.png', '#', 'compact'),
  ('cb-2', 2, 'mallascontrol', 'MALLAS CONTROL', '/Logos/Logo%20mallas%20control.PNG', '#', 'standard'),
  ('cb-3', 3, 'cabrari', 'CABRARI CARNES & LÁCTEOS', '/Logos/CABRARI%20LOGO%20PNG.png', '#', 'standard'),
  ('cb-4', 4, 'inversionesabreu', 'INVERSIONES ABREU CONTRERAS', '/Logos/LOGO%20ABRE%20CONTRERAS.png', '#', 'standard'),
  ('cb-5', 5, 'paralelos', 'PARALELOS INGENIEROS ARQUITECTOS', '/Logos/logo%20paralelos.png', '#', 'compact'),
  ('cb-6', 6, 'dwillyempanadas', 'D''WILLY EMPANADAS Y MÁS', '/Logos/LOGO%20D%20WILLY%20EMPANADAS.png', '#', 'standard'),
  ('cb-7', 7, 'gregorioluperon', 'POLITÉCNICO GREGORIO LUPERÓN', '/Logos/LOGO%20GREGORIO%20LUPERON.png', '#', 'medium')
on conflict (id) do update set
  sort_order = excluded.sort_order,
  slug = excluded.slug,
  name = excluded.name,
  logo_url = excluded.logo_url,
  instagram_url = excluded.instagram_url,
  size = excluded.size,
  updated_at = now();

-- 4. Directorio de Servicios por defecto
insert into public.services (id, sort_order, number_label, title_es, title_en, tags_es, tags_en, description_es, description_en)
values
  ('s1', 1, '01/', 'Publicidad y Consultoría Estratégica', 'Advertising & Strategic Consulting', 'Estrategia de Marca • Análisis de Mercado • Campañas Integrales', 'Brand Strategy • Market Analysis • Integrated Campaigns', 'Diseñamos rutas estratégicas y campañas publicitarias de alto impacto que conectan marcas con su audiencia ideal. Maximizamos el posicionamiento y retorno de inversión mediante consultoría de marketing especializada y orientada a resultados.', 'We design high-impact strategic roadmaps and advertising campaigns that connect brands with their ideal audience. We maximize positioning and return on investment through specialized, results-driven marketing consulting.'),
  ('s2', 2, '02/', 'Diseño Gráfico e Impresión', 'Graphic Design & Printing', 'Identidad Visual • Diseño Editorial • Producción Impresa', 'Visual Identity • Editorial Design • Print Production', 'Sistemas de identidad visual y diseño gráfico meticuloso, materializados a través de servicios de impresión de alta fidelidad. Creamos puntos de contacto físicos y digitales memorables que elevan la percepción de su marca.', 'Visual identity systems and meticulous graphic design brought to life through high-fidelity printing services. We craft memorable physical and digital touchpoints that elevate your brand perception.'),
  ('s3', 3, '03/', 'Producción Audiovisual y Fotografía', 'Audiovisual Production & Photography', 'Dirección de Arte • Cinematografía • Fotografía Comercial', 'Art Direction • Cinematography • Commercial Photography', 'Narrativas visuales cautivadoras a través de producción de video y servicios de fotografía profesional. Capturamos la esencia de su proyecto comercial o corporativo con los más altos estándares estéticos y técnicos.', 'Captivating visual narratives through video production and professional photography services. We capture the essence of your commercial or corporate project with the highest aesthetic and technical standards.'),
  ('s4', 4, '04/', 'Desarrollo y Servicios Web', 'Web Development & Digital Services', 'Diseño UI/UX • Desarrollo a Medida • Ecosistemas Digitales', 'UI/UX Design • Bespoke Development • Digital Ecosystems', 'Arquitectura digital y desarrollo de plataformas web responsivas. Traducimos la identidad de su marca en experiencias de usuario excepcionales, construyendo interfaces intuitivas y escalables para el entorno digital moderno.', 'Digital architecture and responsive web platform development. We translate your brand identity into exceptional user experiences, building intuitive and scalable interfaces for the modern digital landscape.')
on conflict (id) do update set
  sort_order = excluded.sort_order,
  number_label = excluded.number_label,
  title_es = excluded.title_es,
  title_en = excluded.title_en,
  tags_es = excluded.tags_es,
  tags_en = excluded.tags_en,
  description_es = excluded.description_es,
  description_en = excluded.description_en,
  updated_at = now();

-- 5. Soluciones para Cada Industria por defecto
insert into public.industries (id, sort_order, number_label, title_es, title_en, desc_es, desc_en, tag_es, tag_en, sub_es, sub_en, image_url, layout)
values
  ('ind-1', 1, '01 —', 'Construcción e inmobiliaria', 'Construction & Real Estate', 'Proyectos, desarrollos y marcas que necesitan proyectar confianza.', 'Projects, developments, and brands that need to project trust and authority.', '01 // Arquitectura y Desarrollo', '01 // Architecture & Development', '', '', 'https://images.unsplash.com/photo-1541888946425-d09bb18086f6?auto=format&fit=crop&w=1200&q=85', 'feature-dark'),
  ('ind-2', 2, '02 —', 'Distribución y alimentos', 'Distribution & Food Supply', 'Productos, surtidoras y negocios que buscan fortalecer su presencia en el mercado.', 'Products, suppliers, and businesses looking to strengthen their market presence.', '02 // Sector Comercial', '02 // Commercial Sector', '', '', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=85', 'vertical-light'),
  ('ind-3', 3, '03 —', 'Motopréstamos y servicios financieros', 'Vehicle Financing & Financial Services', 'Marcas que necesitan comunicar confianza, accesibilidad y credibilidad.', 'Brands that need to communicate trust, accessibility, and credibility.', '03 // Finanzas y Movilidad', '03 // Finance & Mobility', '', '', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=85', 'monolith-dark'),
  ('ind-4', 4, '04 —', 'Restaurantes y gastronomía', 'Restaurants & Gastronomy', 'Experiencias, productos y espacios que merecen ser vistos y recordados.', 'Experiences, culinary products, and spaces that deserve to be seen and remembered.', '04 // Hospitalidad y Sabor', '04 // Hospitality & Flavor', 'Dirección de Arte Culinaria', 'Culinary Art Direction', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1100&q=85', 'split-wide'),
  ('ind-5', 5, '05 —', 'Equipos y suministros industriales', 'Industrial Equipment & Supplies', 'Soluciones especializadas que necesitan una comunicación clara y profesional.', 'Specialized technical solutions that require clear, authoritative communication.', '05 // Precisión Técnica', '05 // Technical Precision', '', '', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=85', 'horizontal-muted'),
  ('ind-6', 6, '06 —', 'Comercio y servicios', 'Commerce & Services', 'Negocios que quieren destacar, conectar con sus clientes y crecer.', 'Businesses that want to stand out, connect with their customers, and grow.', '06 // Expansión Comercial', '06 // Commercial Growth', '', '', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=85', 'horizontal-light')
on conflict (id) do update set
  sort_order = excluded.sort_order,
  number_label = excluded.number_label,
  title_es = excluded.title_es,
  title_en = excluded.title_en,
  desc_es = excluded.desc_es,
  desc_en = excluded.desc_en,
  tag_es = excluded.tag_es,
  tag_en = excluded.tag_en,
  sub_es = excluded.sub_es,
  sub_en = excluded.sub_en,
  image_url = excluded.image_url,
  layout = excluded.layout,
  updated_at = now();

-- 6. Tags Editables de Proyectos por defecto
insert into public.project_tags (id, sort_order, slug, label_es, label_en)
values
  ('tag-1', 1, 'motion', 'Cine', 'Motion'),
  ('tag-2', 2, 'identity', 'Identidad', 'Identity'),
  ('tag-3', 3, 'spatial', 'Espacial', 'Spatial')
on conflict (id) do update set
  sort_order = excluded.sort_order,
  slug = excluded.slug,
  label_es = excluded.label_es,
  label_en = excluded.label_en,
  updated_at = now();

-- 7. Proyectos Seleccionados por defecto
insert into public.projects (id, sort_order, featured, categories, image_url, badge_es, badge_en, client_es, client_en, meta_es, meta_en, title_es, title_en, summary_es, summary_en, specs_es, specs_en, location)
values
  ('p1', 1, true, array['motion'], 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIwIZmv43bbeNfq9F2A8zdxlm5t5yE7Vy89Dg7mx0H4ZzYEi0dN9SCG5pKa0eNFsiQPzaG96vbhz4jXRDQ_CZOr8LG2AljBdzL3hU83CVaLBDkXvrAHduBA4LnbFqyJVuNJu6mZwlfYM0NvTvlv2oZwZMG-QXETcPDrGhlv9-n1bDHlT-1ArKEuMrfWlr2Pt5LthbeZHwWp1a99lG9zqCxKZhnBulp2yxnFAhfzGQ4', 'Filme Destacado • 35mm', 'Featured Film • 35mm', 'Punta Cana Heritage [Estudio Conceptual]', 'Punta Cana Heritage [Concept Study]', '2024 • Comercial / Docu', '2024 • Commercial / Docu', 'Crónica de Sal y Piedra', 'The Salt & Stone Chronicle', 'Concepto de antología cinematográfica en cuatro partes sobre desarrollos hoteleros patrimoniales, narrado por artesanos locales y concebido para celuloide Kodak de 35mm.', 'A four-part cinematic anthology concept documenting heritage luxury resort developments, narrated through local artisan voices and framed for Kodak 35mm stock.', 'Formato: 35mm y ARRI Alexa Mini LF • Relación de Aspecto: 2.39:1 Scope • Locación: Higüey / Punta Cana', 'Format: 35mm & ARRI Alexa Mini LF • Aspect Ratio: 2.39:1 Scope • Location: Higüey / Punta Cana', 'Higüey • Punta Cana'),
  ('p2', 2, false, array['identity', 'spatial'], 'https://lh3.googleusercontent.com/aida-public/AB6AXuASda-Il1ENca_NnkmFrS5Zc_1aeqA7HKeB8OcmhYW-vJ13cdotL5ZW8a_HmK4eU0rQeDeJv5a4uXxnp2EQ5G94EyFHVHNS8-KE33RX44iSQSWyQt9W7-tieHYVnVgId9Vbz0cv2LHYiMK3NXGPokwUYwLmsSC8p-f9nEjMtUqjq7uhPGToHeD0zF23fMPaOynQwJQ23Od-2ptIwpnHoHAyL91DWAQ3nRJIF-OkLcR9', 'Sistema de Identidad', 'Identity System', 'Casa Macao [Estudio Conceptual]', 'Casa Macao [Concept Study]', '2024 • Espacial e Impreso', '2024 • Spatial & Print', 'Arquitectura de Villa Privada', 'Private Villa Architecture', 'Concepto de identidad visual a medida y gráfica espacial para un santuario eco-resort de ultralujo en los acantilados de Macao.', 'Bespoke visual identity and spatial graphics package concept for an ultra-luxury eco-resort sanctuary nestled in Macao cliffs.', 'Entregables: Arquitectura de Marca, Monograma Propio, Señalética Arquitectónica • Locación: Macao, RD', 'Deliverables: Brand Architecture, Custom Monogram, Architectural Signage • Location: Macao, RD', 'Macao • RD'),
  ('p3', 3, false, array['identity'], 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBcgZk-Qko0kePP1Md2JPqEVABdf_auZ69FWYQ_TlljB4mSNC2P8thwXrSvLhgJJX4cLTCS__onFrYv64hnH1Z6IVEpjub8_7g-bocPZYQfovre0ynMBrqo-3v_zEGLKogF7Eazi6sAD7ixa1HRyOSdftGc_QcVKWGYlYuo1Lp0QlTqVX8_L5Y7G4CZAj0NqeL49qv6hsjCZ6lpyt4cCDKXEsfWh-6a_gq8pnRET16', 'Empaque • Estrategia', 'Packaging • Strategy', 'Bávaro Coffee Co. [Estudio Conceptual]', 'Bávaro Coffee Co. [Concept Study]', '2025 • Lanzamiento Global', '2025 • Global Launch', 'Sindicato de Tueste de Altura', 'High-Altitude Roast Syndicate', 'Concepto integral de narrativa de empaque, arquitectura social y campaña digital para el lanzamiento de café dominicano de especialidad.', 'End-to-end packaging narrative, social architecture, and digital campaign concept launching Dominican specialty coffee.', 'Entregables: Empaque Estructural, Campaña Editorial, Estrategia Digital • Locación: Bávaro, RD', 'Deliverables: Structural Packaging, Editorial Campaign, Digital Strategy • Location: Bávaro, RD', 'Bávaro • RD')
on conflict (id) do update set
  sort_order = excluded.sort_order,
  featured = excluded.featured,
  categories = excluded.categories,
  image_url = excluded.image_url,
  badge_es = excluded.badge_es,
  badge_en = excluded.badge_en,
  client_es = excluded.client_es,
  client_en = excluded.client_en,
  meta_es = excluded.meta_es,
  meta_en = excluded.meta_en,
  title_es = excluded.title_es,
  title_en = excluded.title_en,
  summary_es = excluded.summary_es,
  summary_en = excluded.summary_en,
  specs_es = excluded.specs_es,
  specs_en = excluded.specs_en,
  location = excluded.location,
  updated_at = now();

-- 8. Nuestro Protocolo por defecto
insert into public.process_steps (id, sort_order, number_label, icon, title_es, title_en, desc_es, desc_en, deliverable_es, deliverable_en)
values
  ('proc-1', 1, '01/', 'psychology', 'Inmersión y Estrategia', 'Immersion & Strategy', 'Deconstruimos la fricción del mercado, los arquetipos de audiencia y los puntos de resonancia cultural mediante auditorías cualitativas rigurosas.', 'We deconstruct market friction, audience archetypes, and cultural resonance points through rigorous qualitative audits.', 'Entregable: Códice Estratégico', 'Deliverable: Strategic Codex'),
  ('proc-2', 2, '02/', 'style', 'Dirección Visual', 'Visual Direction', 'Establecemos tensión estilística mediante dirección de arte, maridajes tipográficos, paletas cromáticas y tratados de iluminación cinematográfica.', 'Establishing stylistic tension through art direction, typography pairings, color palettes, and cinematic lighting treatises.', 'Entregable: Biblia de Dirección de Arte', 'Deliverable: Art Direction Bible'),
  ('proc-3', 3, '03/', 'videocam', 'Producción Rigurosa', 'Rigorous Production', 'Ejecución física en sets de estudio y locaciones del Caribe con equipos de precisión, cámaras de cine de alta gama y maestros artesanos.', 'Physical execution on studio stages and Caribbean locations with precision crews, high-end cine cameras, and master craftspeople.', 'Entregable: Activos Maestros de Medios', 'Deliverable: Master Media Assets'),
  ('proc-4', 4, '04/', 'rocket_launch', 'Lanzamiento Cultural', 'Cultural Launch', 'Presentación pública orquestada en nodos digitales y puntos de contacto espaciales, seguida de monitoreo de sentimiento comunitario en tiempo real.', 'Orchestrated public unveiling across digital nodes and spatial touchpoints, followed by real-time community sentiment tracking.', 'Entregable: Despliegue de Mercado', 'Deliverable: Market Deployment')
on conflict (id) do update set
  sort_order = excluded.sort_order,
  number_label = excluded.number_label,
  icon = excluded.icon,
  title_es = excluded.title_es,
  title_en = excluded.title_en,
  desc_es = excluded.desc_es,
  desc_en = excluded.desc_en,
  deliverable_es = excluded.deliverable_es,
  deliverable_en = excluded.deliverable_en,
  updated_at = now();

-- 9. Comentarios / Perspectiva Editorial por defecto
insert into public.testimonials (id, sort_order, kicker_es, kicker_en, badge_es, badge_en, quote_es, quote_en, author_es, author_en, role_es, role_en, location)
values
  ('test-1', 1, 'Perspectiva Editorial // Sector Hospitalidad', 'Editorial Perspective // Hospitality Sector', '01 / 04 • Muestra Editorial', '01 / 04 • Sample Placement', '«Publimarca transformó nuestra presencia de marca, pasando de ser un discreto hotel regional de lujo a un destino internacional de diseño. Su disciplina de cámara e instinto cultural son incomparables.»', '“Publimarca transformed our brand presence from a quiet regional luxury hotel into an international design pilgrimage. Their camera discipline and cultural instinct are peerless.”', 'Atribución de Socio Hotelero [Marcador de Posición]', 'Hospitality Partner Attribution [Placeholder]', 'Dirección Ejecutiva • Grupo Regional de Hospitalidad de Lujo', 'Executive Leadership • Regional Luxury Hospitality Partner', 'Higüey / Punta Cana'),
  ('test-2', 2, 'Perspectiva Editorial // Construcción e Inmobiliaria', 'Editorial Perspective // Real Estate & Architecture', '02 / 04 • Muestra Editorial', '02 / 04 • Sample Placement', '«Su claridad estratégica y dirección visual le dieron a nuestro desarrollo inmobiliario una identidad inconfundible. Desde los dossiers impresos hasta la fotografía arquitectónica, cada detalle proyectó confianza y solidez.»', '“Their strategic clarity and visual direction gave our residential development an unmistakable identity. From print dossiers to architectural photography, every detail projected trust and solidity.”', 'Socio de Construcción e Inmobiliaria [Marcador de Posición]', 'Construction & Real Estate Partner [Placeholder]', 'Dirección de Proyectos • Grupo Desarrollador del Este', 'Project Directorate • Eastern Real Estate Development Group', 'La Altagracia, RD'),
  ('test-3', 3, 'Perspectiva Editorial // Distribución y Comercio', 'Editorial Perspective // Distribution & Commerce', '03 / 04 • Muestra Editorial', '03 / 04 • Sample Placement', '«Trabajar con Publimarca nos permitió unificar nuestra imagen comercial en todos nuestros puntos de distribución. Su capacidad para traducir objetivos de negocio en piezas gráficas memorables marcó un antes y un después.»', '“Working with Publimarca allowed us to unify our commercial image across all our distribution points. Their ability to translate business goals into memorable graphic pieces made all the difference.”', 'Socio Comercial y Distribución [Marcador de Posición]', 'Commercial & Distribution Partner [Placeholder]', 'Gerencia General • Surtidora y Distribuidora Comercial', 'General Management • Supply & Food Enterprise', 'Higüey, RD'),
  ('test-4', 4, 'Perspectiva Editorial // Servicios Financieros y Movilidad', 'Editorial Perspective // Financial Services & Mobility', '04 / 04 • Muestra Editorial', '04 / 04 • Sample Placement', '«Necesitábamos una comunicación cercana, accesible y con alta credibilidad para conectar con nuestra comunidad. El estudio diseñó una campaña y un ecosistema visual que elevó nuestro reconocimiento de inmediato.»', '“We needed a fresh, accessible, and credible communication system to connect with our community. The studio designed a campaign and digital ecosystem that immediately elevated our recognition.”', 'Socio Financiero y Automotriz [Marcador de Posición]', 'Financial & Mobility Partner [Placeholder]', 'Consejo Comercial • División de Financiamiento y Servicios', 'Commercial Board • Financing & Services Division', 'Región Este, RD')
on conflict (id) do update set
  sort_order = excluded.sort_order,
  kicker_es = excluded.kicker_es,
  kicker_en = excluded.kicker_en,
  badge_es = excluded.badge_es,
  badge_en = excluded.badge_en,
  quote_es = excluded.quote_es,
  quote_en = excluded.quote_en,
  author_es = excluded.author_es,
  author_en = excluded.author_en,
  role_es = excluded.role_es,
  role_en = excluded.role_en,
  location = excluded.location,
  updated_at = now();


-- profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own profile upsert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- portfolio_items
CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  aliases TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;
GRANT ALL ON public.portfolio_items TO service_role;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own portfolio all" ON public.portfolio_items FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX portfolio_items_user_idx ON public.portfolio_items(user_id);

-- conversations
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  briefing TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.conversations TO authenticated;
GRANT ALL ON public.conversations TO service_role;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own conv all" ON public.conversations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX conversations_user_idx ON public.conversations(user_id, created_at DESC);

-- messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user','assistant','system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own messages all" ON public.messages FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX messages_conv_idx ON public.messages(conversation_id, created_at);

-- discovery_states
CREATE TABLE public.discovery_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL UNIQUE REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  facts JSONB NOT NULL DEFAULT '[]'::jsonb,
  asked_themes TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  coverage_by_category JSONB NOT NULL DEFAULT jsonb_build_object(
    'contexto_negocio', 0, 'ambiente_atual', 0, 'escopo_tecnico', 0,
    'operacao_sustentacao', 0, 'seguranca_conformidade', 0, 'volumetria_capacidade', 0,
    'criticidade', 0, 'governanca', 0, 'premissas_exclusoes', 0, 'riscos_validacoes', 0
  ),
  primary_category TEXT,
  secondary_categories TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  classification_confidence REAL NOT NULL DEFAULT 0,
  pending_category TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.discovery_states TO authenticated;
GRANT ALL ON public.discovery_states TO service_role;
ALTER TABLE public.discovery_states ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own state all" ON public.discovery_states FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- executive_understandings
CREATE TABLE public.executive_understandings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  summary TEXT NOT NULL DEFAULT '',
  diagnosis TEXT NOT NULL DEFAULT '',
  missing_information TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  risks TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  assumptions TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  next_steps TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  complexity TEXT NOT NULL DEFAULT 'media',
  human_review_notice TEXT NOT NULL DEFAULT 'Saída gerada por IA — apoio à decisão. Requer revisão de um profissional de pré-vendas antes do uso com clientes.',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.executive_understandings TO authenticated;
GRANT ALL ON public.executive_understandings TO service_role;
ALTER TABLE public.executive_understandings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own understanding all" ON public.executive_understandings FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX understanding_conv_idx ON public.executive_understandings(conversation_id, version DESC);

-- artifacts
CREATE TABLE public.artifacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.artifacts TO authenticated;
GRANT ALL ON public.artifacts TO service_role;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own artifacts all" ON public.artifacts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX artifacts_conv_idx ON public.artifacts(conversation_id, created_at DESC);

-- prompts + versions
CREATE TABLE public.prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Discovery Master Prompt',
  is_active BOOLEAN NOT NULL DEFAULT true,
  active_version_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompts TO authenticated;
GRANT ALL ON public.prompts TO service_role;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own prompts all" ON public.prompts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.prompt_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompt_versions TO authenticated;
GRANT ALL ON public.prompt_versions TO service_role;
ALTER TABLE public.prompt_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own prompt versions all" ON public.prompt_versions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX prompt_versions_idx ON public.prompt_versions(prompt_id, version_number DESC);

-- trigger: auto-create profile + seed portfolio on new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));

  INSERT INTO public.portfolio_items (user_id, category, name, description, aliases) VALUES
    (NEW.id, 'Dados', 'Modernização de Data Platform', 'Migração de warehouse legado para lakehouse cloud com governança e observabilidade.', ARRAY['data platform','lakehouse','data warehouse']),
    (NEW.id, 'IA/ML', 'Chatbot com RAG Corporativo', 'Assistente conversacional com Retrieval-Augmented Generation sobre base documental do cliente.', ARRAY['rag','chatbot','assistente']),
    (NEW.id, 'Infra', 'Migração Cloud AWS', 'Lift-and-shift + refatoração seletiva para AWS com landing zone e FinOps.', ARRAY['cloud migration','aws','landing zone']),
    (NEW.id, 'Segurança', 'Programa Zero Trust', 'Implementação de identidade, segmentação e verificação contínua.', ARRAY['zero trust','iam']),
    (NEW.id, 'Produto', 'Discovery de Produto Digital', 'Descoberta acelerada de MVP com desk research + entrevistas + prototipagem.', ARRAY['discovery','mvp']);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

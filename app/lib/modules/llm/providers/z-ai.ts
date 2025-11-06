import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { LanguageModelV1 } from 'ai';
import type { IProviderSetting } from '~/types/model';
import { createOpenAI } from '@ai-sdk/openai';

export default class ZAIProvider extends BaseProvider {
  name = 'Z AI';
  getApiKeyLink = 'https://z.ai/subscribe';

  config = {
    apiTokenKey: 'ZAI_API_KEY',
  };

  staticModels: ModelInfo[] = [
    {
      name: 'glm-4.6',
      label: 'GLM-4.6',
      provider: 'Z AI',
      maxTokenAllowed: 200000,
      maxCompletionTokens: 128000,
    },
    {
      name: 'glm-4.5-air',
      label: 'GLM-4.5 Air',
      provider: 'Z AI',
      maxTokenAllowed: 128000,
      maxCompletionTokens: 96000,
    },
  ];

  async getDynamicModels(
    apiKeys?: Record<string, string>,
    settings?: IProviderSetting,
    serverEnv?: Record<string, string>,
  ): Promise<ModelInfo[]> {
    // Z AI doesn't support dynamic model listing via API
    // Return static models only
    return [];
  }

  getModelInstance(options: {
    model: string;
    serverEnv: Record<string, string>;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { apiKeys, model, serverEnv } = options;
    const apiKey = apiKeys?.[this.config.apiTokenKey] || serverEnv[this.config.apiTokenKey] || '';

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    return createOpenAI({
      apiKey,
      baseURL: 'https://api.z.ai/api/coding/paas/v4',
    })(model);
  }
}

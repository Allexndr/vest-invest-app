# KazInvest Mobile: Монетизация 2026
## Психологически-грамотная модель конверсии

### 1. Философия: "Пользователь ПРИХОДИТ к платежу сам"

**Ключевой принцип:** Не продавать — помогать достичь цели. Платеж = логичное продолжение пути.

```
Воронка ценности:
AHA-момент → Проблема → Решение в Premium → Триггер → Оплата → Усиление ценности
```

### 2. Триггеры конверсии (Behavioral Psychology)

#### 2.1 Прогрессивный Unlock (IKEA Effect)
- Пользователь вкладывает время → ценит результат → готов платить за сохранение
- **Механика:** Бесплатно до 5 транзакций, затем "История портфеля заблокирована"
- **Сообщение:** "Вы отслеживаете портфель 3 дня. Premium сохранит всю историю"

#### 2.2 FOMO + Срочность (Scarcity)
- Таймеры с ограниченными предложениями
- **Пример:** "Осталось 2 часа на скидку 50% первый месяц"
- Только для активных пользователей (открывал app за последние 24ч)

#### 2.3 Социальное доказательство (Social Proof)
- "47,832 инвестора уже используют AI-аналитику"
- Leaderboard: Premium-фича видна но заблокирована (greyed out с замком)
- "Ваш друг @username только что получил Premium"

#### 2.4 Потеря аверсии (Loss Aversion)
- Не "Получите бонусы", а "Не потеряйте накопленный прогресс"
- **Пример:** "Ваш стрик 12 дней. Premium сохранит прогресс при пропуске"
- Тестовый период ending soon с обратным отсчетом

#### 2.5 Якорная ценность (Anchoring)
- Сравнение с конкурентами: "TradingView Pro $199, KazInvest Premium $9.99"
- Годовая подписка выгоднее: "Экономия 40%"

### 3. Уровни подписок (Value Ladder)

| Уровень | Цена | Триггер | Ключевые фичи |
|---------|------|---------|---------------|
| **Free** | $0 | Вход в воронку | До 5 позиций, базовые графики, 3 урока |
| **Investor** | $4.99/мес | Портфель >5 позиций | Нелимит портфель, экспорт, базовые алерты |
| **Trader** | $9.99/мес | Активная торговля | AI-аналитика, real-time, налоговый отчет |
| **Pro** | $19.99/мес | Серьезный инвестор | Все модули, API, приоритетная поддержка |

### 4. Точки активации платежа (In-App Upsells)

#### 4.1 Контекстные триггеры
```typescript
// Пользователь пытается добавить 6-ю позицию
if (positions.length >= 5 && !isPremium) {
  showUpsell("portfolio_limit", {
    title: "Портфель заполнен",
    subtitle: "5 позиций — лимит Free. Investor+ = безлимит",
    cta: "Разблокировать за $4.99",
    context: "portfolio_full"
  });
}

// Пользователь открыл академию 3-й раз
if (academyViews >= 3 && !isPremium) {
  showUpsell("academy_progress", {
    title: "Вы настойчивы! 🎓",
    subtitle: "Продолжите обучение с Premium — доступ ко всем трекам",
    cta: "Получить доступ",
    context: "academy_engaged"
  });
}

// Пользователь смотрит график >30 сек
if (chartViewTime > 30 && !hasAdvancedCharts) {
  showUpsell("chart_features", {
    title: "Хотите больше индикаторов?",
    subtitle: "RSI, MACD, Bollinger Bands в Trader",
    cta: "Апгрейд",
    context: "chart_power_user"
  });
}
```

#### 4.2 Smart Upsell Sheet (Bottom Sheet)
- Не модальный попап, а элегантный bottom sheet
- Контекстная картинка (график/портфель/академия)
- Социальное доказательство: "12,483 инвестора выбрали этот план"
- Гарантия: "7 дней возврат, без вопросов"

### 5. Платежные методы (Глобальная доступность)

```typescript
const PAYMENT_METHODS = {
  // Apple / Google (для mobile-first)
  apple: {
    type: 'iap',
    available: Platform.OS === 'ios',
    products: ['investor_monthly', 'trader_monthly', 'pro_yearly'],
    commission: '15-30%',
    advantage: 'One-tap purchase, Face ID'
  },
  
  // Telegram Stars (для Telegram users)
  stars: {
    type: 'telegram',
    available: true,
    products: ['investor_1000stars', 'trader_2000stars'],
    commission: '0% (Telegram subsidy)',
    advantage: 'No credit card needed, global'
  },
  
  // Крипто (для advanced users)
  crypto: {
    type: 'crypto',
    available: true,
    chains: ['TON', 'USDT-TRC20', 'BTC'],
    advantage: 'Anonymous, no borders, low fees'
  },
  
  // Карты (резервный)
  card: {
    type: 'stripe',
    available: true,
    processors: ['Stripe', 'PayPal'],
    advantage: 'Universal, subscriptions'
  }
};
```

### 6. Freemium Engineering (Product-Led Growth)

#### 6.1 Бесплатный ценности:
1. **Демо-портфель** — можно тыкать без реальных денег
2. **3 базовых урока** — инвестиции 101
3. **1 актив в watchlist** — Apple или KSPI
4. **Дневная сводка** — базовая новость

#### 6.2 Soft Gates (грациозные ограничения):
- Не "ЗАПРЕЩЕНО", а "Разблокируйте потенциал"
- Preview фичи: "AI-анализ говорит: [заблюрено]. Premium чтобы увидеть"
- Прогресс-бар: "3/5 позиций использовано"

### 7. Триал-стратегия (Trial Engineering)

```
Day 0:  Активация триала (no card required)
Day 1:  Welcome push + tip "Начните с портфеля"
Day 3:  "У вас уже 3 позиции! Добавьте еще с Premium"
Day 5:  "Ваши акции выросли на 2.3%! Отчет в Premium"
Day 7:  "Осталось 24 часа триала — сохраните прогресс"
Day 8:  Если не конвертировался → Offer $1 первый месяц
```

### 8. Retention через монетизацию

- **Персональные скидки:** "Вернитесь со скидкой 70%"
- **Win-back campaigns:** Push после 7 дней неактивности
- **Referral бонусы:** "Пригласите друга = 1 месяц бесплатно"
- **Achievement unlocks:** "Пройдите 10 уроков = скидка 20%"

### 9. Метрики конверсии (KPIs)

| Метрика | Target |
|---------|--------|
| Trial-to-Paid | >25% |
| Free-to-Trial | >60% |
| Day 7 Retention (paid) | >70% |
| ARPU | >$8/мес |
| LTV | >$120 |
| Churn (monthly) | <8% |

### 10. Этика и доверие (Anti-Dark Patterns)

✅ **Делаем:**
- Clear pricing без hidden fees
- Легкий cancel anytime
- Просим разрешение перед платежом
- Показываем реальную ценность

❌ **Не делаем:**
- Trick questions ("Uncheck to NOT subscribe")
- Roach motel (easy in, hard out)
- Confirmshaming ("No, I hate making money")
- Fake urgency (always "2 hours left")

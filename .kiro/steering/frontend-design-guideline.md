---
inclusion: auto
---

# Frontend Design Guideline

This document summarizes key frontend design principles and rules, showcasing recommended patterns. Follow these guidelines when writing frontend code.

# Readability

Improving the clarity and ease of understanding code.

## Naming Magic Numbers

**Rule:** Replace magic numbers with named constants for clarity.

**Reasoning:**
- Improves clarity by giving semantic meaning to unexplained values.
- Enhances maintainability.

#### Recommended Pattern:

```typescript
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS); // Clearly indicates waiting for animation
  await refetchPostLike();
}
```

## Abstracting Implementation Details

**Rule:** Abstract complex logic/interactions into dedicated components/HOCs.

**Reasoning:**
- Reduces cognitive load by separating concerns.
- Improves readability, testability, and maintainability of components.

#### Recommended Pattern 1: Auth Guard

```tsx
function App() {
  return (
    <AuthGuard>
      <LoginStartPage />
    </AuthGuard>
  );
}

function AuthGuard({ children }) {
  const status = useCheckLoginStatus();

  useEffect(() => {
    if (status === "LOGGED_IN") {
      location.href = "/home";
    }
  }, [status]);

  return status !== "LOGGED_IN" ? children : null;
}
```

#### Recommended Pattern 2: Dedicated Interaction Component

```tsx
function InviteButton({ name }) {
  const handleClick = async () => {
    const canInvite = await overlay.openAsync(({ isOpen, close }) => (
      <ConfirmDialog title={`Share with ${name}`} />
    ));
    if (canInvite) await sendPush();
  };

  return <Button onClick={handleClick}>Invite</Button>;
}
```

## Separating Code Paths for Conditional Rendering

**Rule:** Separate significantly different conditional UI/logic into distinct components.

**Reasoning:**
- Improves readability by avoiding complex conditionals within one component.
- Ensures each specialized component has a clear, single responsibility.

#### Recommended Pattern:

```tsx
function SubmitButton() {
  const isViewer = useRole() === "viewer";
  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}

function ViewerSubmitButton() {
  return <TextButton disabled>Submit</TextButton>;
}

function AdminSubmitButton() {
  useEffect(() => { showAnimation(); }, []);
  return <Button type="submit">Submit</Button>;
}
```

## Simplifying Complex Ternary Operators

**Rule:** Replace complex/nested ternaries with `if`/`else` or IIFEs for readability.

#### Recommended Pattern:

```typescript
const status = (() => {
  if (ACondition && BCondition) return "BOTH";
  if (ACondition) return "A";
  if (BCondition) return "B";
  return "NONE";
})();
```


## Reducing Eye Movement (Colocating Simple Logic)

**Rule:** Colocate simple, localized logic or use inline definitions to reduce context switching.

#### Recommended Pattern A: Inline `switch`

```tsx
function Page() {
  const user = useUser();

  switch (user.role) {
    case "admin":
      return <div><Button disabled={false}>Invite</Button></div>;
    case "viewer":
      return <div><Button disabled={true}>Invite</Button></div>;
    default:
      return null;
  }
}
```

#### Recommended Pattern B: Colocated simple policy object

```tsx
function Page() {
  const user = useUser();

  const policy = {
    admin: { canInvite: true, canView: true },
    viewer: { canInvite: false, canView: true },
  }[user.role];

  if (!policy) return null;

  return (
    <div>
      <Button disabled={!policy.canInvite}>Invite</Button>
      <Button disabled={!policy.canView}>View</Button>
    </div>
  );
}
```

## Naming Complex Conditions

**Rule:** Assign complex boolean conditions to named variables.

**Reasoning:**
- Makes the _meaning_ of the condition explicit.
- Improves readability and self-documentation by reducing cognitive load.

#### Recommended Pattern:

```typescript
const matchedProducts = products.filter((product) => {
  const isSameCategory = product.categories.some(
    (category) => category.id === targetCategory.id
  );
  const isPriceInRange = product.prices.some(
    (price) => price >= minPrice && price <= maxPrice
  );
  return isSameCategory && isPriceInRange;
});
```

**Guidance:** Name conditions when the logic is complex, reused, or needs unit testing. Avoid naming very simple, single-use conditions.

---

# Predictability

Ensuring code behaves as expected based on its name, parameters, and context.

## Standardizing Return Types

**Rule:** Use consistent return types for similar functions/hooks.

#### Recommended Pattern 1: API Hooks (React Query)

```typescript
import { useQuery, UseQueryResult } from "@tanstack/react-query";

function useUser(): UseQueryResult<UserType, Error> {
  return useQuery({ queryKey: ["user"], queryFn: fetchUser });
}

function useServerTime(): UseQueryResult<Date, Error> {
  return useQuery({ queryKey: ["serverTime"], queryFn: fetchServerTime });
}
```

#### Recommended Pattern 2: Validation Functions

```typescript
type ValidationResult = { ok: true } | { ok: false; reason: string };

function checkIsNameValid(name: string): ValidationResult {
  if (name.length === 0) return { ok: false, reason: "Name cannot be empty." };
  if (name.length >= 20) return { ok: false, reason: "Name cannot be longer than 20 characters." };
  return { ok: true };
}
```

## Revealing Hidden Logic (Single Responsibility)

**Rule:** Avoid hidden side effects; functions should only perform actions implied by their signature (SRP).

#### Recommended Pattern:

```typescript
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>("...");
  return balance;
}

async function handleUpdateClick() {
  const balance = await fetchBalance();
  logging.log("balance_fetched");
  await syncBalance(balance);
}
```

## Using Unique and Descriptive Names (Avoiding Ambiguity)

**Rule:** Use unique, descriptive names for custom wrappers/functions to avoid ambiguity.

#### Recommended Pattern:

```typescript
export const httpService = {
  async getWithAuth(url: string) {
    const token = await fetchToken();
    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export async function fetchUser() {
  return await httpService.getWithAuth("...");
}
```

---

# Cohesion

Keeping related code together and ensuring modules have a well-defined, single purpose.

## Considering Form Cohesion

**Rule:** Choose field-level or form-level cohesion based on form requirements.

**Guidance:** Choose **field-level** for independent validation, async checks, or reusable fields. Choose **form-level** for related fields, wizard forms, or interdependent validation.

#### Recommended Pattern (Field-Level):

```tsx
export function Form() {
  const { register, formState: { errors }, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("name", {
          validate: (value) =>
            value.trim() === "" ? "Please enter your name." : true,
        })}
      />
      {errors.name && <p>{errors.name.message}</p>}
    </form>
  );
}
```

#### Recommended Pattern (Form-Level):

```tsx
const schema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.string().min(1).email("Invalid email."),
});

export function Form() {
  const { register, formState: { errors }, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} />
      {errors.name && <p>{errors.name.message}</p>}
    </form>
  );
}
```


## Organizing Code by Feature/Domain

**Rule:** Organize directories by feature/domain, not just by code type.

#### Recommended Pattern:

```
src/
├── components/   # Shared/common components
├── hooks/        # Shared/common hooks
├── utils/        # Shared/common utils
├── domains/
│   ├── user/
│   │   ├── components/
│   │   │   └── UserProfileCard.tsx
│   │   ├── hooks/
│   │   │   └── useUser.ts
│   │   └── index.ts
│   ├── product/
│   │   ├── components/
│   │   └── hooks/
│   └── order/
│       ├── components/
│       └── hooks/
└── App.tsx
```

## Relating Magic Numbers to Logic

**Rule:** Define constants near related logic or ensure names link them clearly.

```typescript
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

---

# Coupling

Minimizing dependencies between different parts of the codebase.

## Balancing Abstraction and Coupling (Avoiding Premature Abstraction)

**Rule:** Avoid premature abstraction of duplicates if use cases might diverge; prefer lower coupling.

**Guidance:** Before abstracting, consider if the logic is truly identical and likely to _stay_ identical. If divergence is possible, keeping logic separate initially can lead to more maintainable, decoupled code.

## Scoping State Management (Avoiding Overly Broad Hooks)

**Rule:** Break down broad state management into smaller, focused hooks/contexts.

#### Recommended Pattern:

```typescript
export function useCardIdQueryParam() {
  const [cardIdParam, setCardIdParam] = useQueryParam("cardId", NumberParam);

  const setCardId = useCallback(
    (newCardId: number | undefined) => setCardIdParam(newCardId, "replaceIn"),
    [setCardIdParam]
  );

  return [cardIdParam ?? undefined, setCardId] as const;
}
```

## Eliminating Props Drilling with Composition

**Rule:** Use Component Composition instead of Props Drilling.

#### Recommended Pattern:

```tsx
function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState("");

  return (
    <Modal open={open} onClose={onClose}>
      <Input value={keyword} onChange={(e) => setKeyword(e.target.value)} />
      <ItemEditList
        keyword={keyword}
        items={items}
        recommendedItems={recommendedItems}
        onConfirm={onConfirm}
      />
    </Modal>
  );
}
```

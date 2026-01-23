# Modal Component (Section 3.5)

## Overview

The Modal component is a reusable, accessible dialog component for displaying content that requires user attention or interaction. It includes animation, keyboard support, backdrop interaction, and flexible sizing options.

## Design Specifications

### Structure

#### Backdrop

- **Color**: Black with 50% opacity (#000000 with 50% alpha)
- **Filter**: Blur effect (backdrop-blur-sm)
- **Behavior**: Click to dismiss (configurable)
- **Z-Index**: 50

#### Container

- **Position**: Centered on screen (both vertically and horizontally)
- **Background**: White (#FFFFFF)
- **Border Radius**: 12px (rounded-xl)
- **Shadow**: Level 5 (shadow-lg)
- **Max Width (Default)**: 600px
- **Max Width (Large)**: 900px
- **Max Height**: 90vh - 200px (scrollable if content exceeds)

#### Header

- **Padding**: 24px (px-6 py-6)
- **Title**: 24px, semibold (#374151)
- **Close Button**: X icon, top-right
- **Border**: 1px bottom border (#E5E7EB)

#### Body

- **Padding**: 24px (px-6 py-6)
- **Background**: White
- **Max Height**: Scrollable
- **Text Color**: #6B7280

#### Footer

- **Padding**: 16px (px-6 py-4)
- **Background**: #F9FAFB (gray-50)
- **Buttons**: Right-aligned
- **Border**: 1px top border (#E5E7EB)

### Animations

#### Open Animation

- **Type**: Fade + Scale
- **Duration**: 200ms
- **Scale**: 0.95 → 1.0
- **Opacity**: 0 → 1
- **Easing**: ease-out (implicit)

#### Close Animation

- **Type**: Reverse of open
- **Duration**: 200ms
- **Scale**: 1.0 → 0.95
- **Opacity**: 1 → 0

### Close Triggers

✅ **X Button**: Click close button in header  
✅ **Backdrop Click**: Click outside modal (configurable)  
✅ **ESC Key**: Press Escape key  
✅ **Cancel Button**: Custom button in footer

---

## Component API

### Main Components

#### `<Modal />`

```typescript
interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  onBackdropClick?: () => void;
}
```

The main modal wrapper. Handles backdrop, animations, and keyboard interactions.

**Props:**

- `isOpen` - Controls modal visibility
- `onClose` - Callback when modal should close
- `onBackdropClick` - Optional callback for backdrop clicks (calls onClose if not provided)
- `children` - Modal content (ModalHeader, ModalBody, ModalFooter)

#### `<ModalHeader />`

```typescript
interface ModalHeaderProps {
  title: string;
  onClose?: () => void;
  className?: string;
}
```

Modal header with title and close button.

**Props:**

- `title` - Header title text
- `onClose` - Optional override for close callback
- `className` - Additional CSS classes

#### `<ModalBody />`

```typescript
interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}
```

Modal body content area (scrollable).

**Props:**

- `children` - Body content
- `className` - Additional CSS classes

#### `<ModalFooter />`

```typescript
interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}
```

Modal footer with buttons (right-aligned by default).

**Props:**

- `children` - Footer content (typically buttons)
- `className` - Additional CSS classes

### Hooks

#### `useModal()`

```typescript
function useModal(initialState?: boolean);
```

Hook for managing modal state.

**Returns:**

- `isOpen` - Current modal state
- `open()` - Open modal
- `close()` - Close modal
- `toggle()` - Toggle modal state

**Example:**

```tsx
const { isOpen, open, close } = useModal();
```

---

## Usage Examples

### Basic Modal

```tsx
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useModal } from "@/components/ui/modal";

export function BasicModal() {
  const { isOpen, open, close } = useModal();

  return (
    <>
      <Button onClick={open}>Open Modal</Button>

      <Modal isOpen={isOpen} onClose={close}>
        <ModalHeader title="Confirm Action" onClose={close} />
        <ModalBody>
          <p>Are you sure you want to proceed?</p>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" onClick={close}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

### Delete Confirmation Modal

```tsx
export function DeleteConfirmationModal() {
  const { isOpen, open, close } = useModal();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteItem();
      close();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button variant="destructive" onClick={open}>
        Delete
      </Button>

      <Modal isOpen={isOpen} onClose={close}>
        <ModalHeader title="Delete Item" onClose={close} />
        <ModalBody>
          <p className="text-red-600 font-medium">
            This action cannot be undone.
          </p>
          <p className="text-gray-600 mt-2">
            Are you sure you want to delete this item?
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={close} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

### Large Modal with Form

```tsx
export function FormModal() {
  const { isOpen, open, close } = useModal();
  const [formData, setFormData] = React.useState({ name: "", email: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    close();
  };

  return (
    <>
      <Button onClick={open}>Edit Profile</Button>

      <Modal isOpen={isOpen} onClose={close}>
        <ModalHeader title="Edit Profile" onClose={close} />
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
```

### Custom Modal Positioning

```tsx
export function CustomModal() {
  const { isOpen, open, close } = useModal();

  return (
    <>
      <Button onClick={open}>Open Custom Modal</Button>

      <Modal isOpen={isOpen} onClose={close}>
        <div className="max-w-2xl">
          <ModalHeader title="Wide Modal" onClose={close} />
          <ModalBody>
            <p>This modal uses a wider container (900px max-width).</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={close}>
              Close
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </>
  );
}
```

---

## Styling

### CSS Classes Used

```css
/* Backdrop */
bg-black/50                 /* 50% black opacity */
backdrop-blur-sm            /* Blur effect */
fixed inset-0               /* Full screen coverage */

/* Container */
rounded-xl                  /* 12px radius */
shadow-lg                   /* Level 5 shadow */
max-w-[600px]              /* Default width */
max-w-[900px]              /* Large width */
max-h-[calc(90vh-200px)]   /* Max height with scroll */

/* Header */
px-6 py-6                   /* 24px padding */
border-b border-gray-200    /* Bottom border */
text-2xl font-semibold      /* 24px semibold */

/* Body */
px-6 py-6                   /* 24px padding */
overflow-y-auto             /* Vertical scroll */

/* Footer */
px-6 py-4                   /* 16px padding */
bg-gray-50                  /* #F9FAFB */
border-t border-gray-200    /* Top border */

/* Animations */
transition-all duration-200 /* 200ms transition */
scale-100 / scale-95        /* Scale animation */
opacity-100 / opacity-0     /* Fade animation */
```

### Customization

Override styles using className prop:

```tsx
<Modal isOpen={isOpen} onClose={close}>
  <ModalHeader title="Custom Styled Header" className="bg-blue-50" />
  <ModalBody className="bg-blue-50">
    <p>Custom colored body</p>
  </ModalBody>
</Modal>
```

---

## Accessibility

✅ **Semantic HTML**: Uses `role="dialog"` and `aria-modal="true"`  
✅ **Keyboard Support**: ESC key closes modal  
✅ **Focus Management**: Focus trap within modal  
✅ **Screen Readers**: ARIA labels on close button  
✅ **Color Contrast**: Meets WCAG standards  
✅ **Focus Visible**: Clear focus indicators

---

## Keyboard Shortcuts

| Key            | Action      |
| -------------- | ----------- |
| ESC            | Close modal |
| Click X        | Close modal |
| Click backdrop | Close modal |

---

## Animation Specifications

### Open Animation

```css
transition: all 200ms ease-out;
transform: scale(0.95) → scale(1);
opacity: 0 → 1;
```

### Close Animation

```css
transition: all 200ms ease-out;
transform: scale(1) → scale(0.95);
opacity: 1 → 0;
```

---

## Close Triggers

| Trigger        | Behavior       | Configurable                    |
| -------------- | -------------- | ------------------------------- |
| X Button       | Calls onClose  | ✅ Override via onClose prop    |
| Backdrop Click | Calls onClose  | ✅ Override via onBackdropClick |
| ESC Key        | Calls onClose  | ✅ Always enabled               |
| Cancel Button  | Custom handler | ✅ User-defined                 |

---

## Browser Support

✅ Chrome 90+  
✅ Firefox 88+  
✅ Safari 14+  
✅ Edge 90+

---

## Performance

- ✅ No external dependencies
- ✅ Optimized animations with CSS transitions
- ✅ Proper cleanup of event listeners
- ✅ Body scroll prevention when modal open

---

## Common Patterns

### Alert Modal

```tsx
<Modal isOpen={isOpen} onClose={close}>
  <ModalHeader title="Alert" onClose={close} />
  <ModalBody>
    <p className="text-lg">Important message</p>
  </ModalBody>
  <ModalFooter>
    <Button onClick={close}>OK</Button>
  </ModalFooter>
</Modal>
```

### Confirmation Modal

```tsx
<Modal isOpen={isOpen} onClose={close}>
  <ModalHeader title="Confirm" onClose={close} />
  <ModalBody>
    <p>Do you want to proceed?</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={close}>
      No
    </Button>
    <Button onClick={handleConfirm}>Yes</Button>
  </ModalFooter>
</Modal>
```

### Loading Modal

```tsx
<Modal isOpen={isOpen} onClose={close}>
  <ModalBody className="flex items-center justify-center py-12">
    <div className="animate-spin">
      <Loader2 className="h-8 w-8" />
    </div>
  </ModalBody>
</Modal>
```

---

## Future Enhancements

- [ ] Nested modals support
- [ ] Custom backdrop colors
- [ ] Slide-in animation variants
- [ ] Dismissible variants
- [ ] Size variants (xs, sm, md, lg)
- [ ] Modal stack management

---

## Related Components

- [Button](/components/ui/button.tsx)
- [Input](/components/ui/input.tsx)
- [Form](/components/ui/form.tsx)

---

## Dependencies

- `react` - React library
- `lucide-react` - X icon
- `tailwindcss` - Styling

---

**Last Updated**: January 23, 2026  
**Status**: ✅ Production Ready

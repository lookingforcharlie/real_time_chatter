import { cva, VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { ButtonHTMLAttributes, FC } from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'active-scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disable:pointer-events-none',

  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white hover:bg-slate-800',
        ghost: 'bg-transparent hover:text-slate-900 hover:bg-slate-200',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// ButtonHTMLAttributes<HTMLButtonElement>: whatever props we pass to the button includes whatever we can pass to a default button in react
// VariantProps<typeof buttonVariants>: we get this from cva. Now we can pass variants we defined above
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

// destructuring the props, taken away from the original props
// ...props is placeholder for catch-all
const Button: FC<ButtonProps> = ({
  className,
  children,
  variant,
  isLoading,
  size,
  ...props
}) => {
  return (
    // what cn does: if we want to overwrite the style anywhere we render the button, we can do that, such as change bg, color etc
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {/* take one second the spin around */}
      {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : null}
      {/* render everything else out that is passed to the button */}
      {/* Example: <Button>Hello<Button>, hello is the children rendered inside the Button component */}
      {children}
    </button>
  );
};

export default Button;

export function Footer() {
    return (
      <footer className="border-t bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SpeedTracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }
  
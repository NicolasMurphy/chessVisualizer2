import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ImportGame = ({
  pgnInput,
  readPgn,
  pgnValid,
  currentPgn,
  setPgnValid,
}) => {
  const [showMessage, setShowMessage] = useState(false);
  useEffect(() => {
    if (pgnValid !== undefined) {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false);
        setPgnValid(undefined);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [pgnValid]);

  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Import Game</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import Game</DialogTitle>
            <DialogDescription>
              Import one of your own games, or from a database
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="pgn-1">Pgn Text</Label>
              <div>
                {showMessage && (
                  <>
                    {!pgnValid || pgnValid === undefined ? (
                      <div className="text-red-600 text-sm">
                        Cannot parse PGN
                      </div>
                    ) : (
                      <div className="text-green-600 text-sm">
                        Game imported successfully!
                      </div>
                    )}
                  </>
                )}
              </div>
              <Textarea
                id="pgn-1"
                name="username"
                placeholder="e4 e5 Nf3..."
                onChange={e => pgnInput(e)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={() => readPgn(currentPgn)}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default ImportGame;

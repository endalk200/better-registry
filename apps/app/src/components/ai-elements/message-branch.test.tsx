import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  MessageBranch,
  MessageBranchContent,
} from "@/components/ai-elements/message";

interface HarnessProps {
  onBranchChange: (index: number) => void;
}

const BranchHarness = ({ onBranchChange }: HarnessProps) => {
  const [branchCount, setBranchCount] = useState(2);

  return (
    <div>
      <button onClick={() => setBranchCount(1)} type="button">
        Shrink branches
      </button>
      <MessageBranch defaultBranch={1} onBranchChange={onBranchChange}>
        <MessageBranchContent>
          {Array.from({ length: branchCount }, (_, index) => (
            <div key={`branch-${index}`}>Branch {index}</div>
          ))}
        </MessageBranchContent>
      </MessageBranch>
    </div>
  );
};

describe("MessageBranch", () => {
  it("clamps the current branch index when branches shrink", async () => {
    const onBranchChange = vi.fn();

    render(<BranchHarness onBranchChange={onBranchChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Shrink branches" }));

    await waitFor(() => {
      expect(onBranchChange).toHaveBeenCalledWith(0);
    });

    expect(screen.getByText("Branch 0")).toBeInTheDocument();
  });
});

import { screen, waitFor, within } from '@testing-library/svelte';

import { expect } from 'vitest';

import userEvent from '@testing-library/user-event';

import type { Role } from '$lib/models/keycloak';

import { fetchMock } from '../setup';

export interface FooterButtonVisibility {
  comments: boolean;
  download: boolean;
  validate: boolean;
  assign: boolean;
  publish: boolean;
}

export function checkFooterButtonVisibility(): FooterButtonVisibility {
  return {
    comments: screen.queryByRole('button', { name: 'formfooter.comments' }) !== null,
    download: screen.queryByRole('button', { name: 'formfooter.download' }) !== null,
    validate: screen.queryByRole('button', { name: 'formfooter.validate' }) !== null,
    assign: screen.queryByRole('button', { name: 'formfooter.assign' }) !== null,
    publish: screen.queryByRole('button', { name: 'formfooter.publish' }) !== null
  };
}

export function verifyDataOwnerButtons() {
  const visibility = checkFooterButtonVisibility();

  expect(visibility.comments).toBe(true);
  expect(visibility.download).toBe(false);
  expect(visibility.validate).toBe(true);
  expect(visibility.assign).toBe(true);
  expect(visibility.publish).toBe(false);
}

export function verifyEditorButtons(assignedToMe: boolean, approved: boolean, allValid: boolean) {
  const visibility = checkFooterButtonVisibility();

  expect(visibility.comments).toBe(true);
  expect(visibility.download).toBe(true);
  expect(visibility.validate).toBe(true);
  expect(visibility.assign).toBe(assignedToMe);
  expect(visibility.publish).toBe(assignedToMe && approved && allValid);
}

export function verifyQAButtons(assignedToMe: boolean) {
  const visibility = checkFooterButtonVisibility();

  expect(visibility.comments).toBe(true);
  expect(visibility.download).toBe(true);
  expect(visibility.validate).toBe(true);
  expect(visibility.assign).toBe(assignedToMe);
  expect(visibility.publish).toBe(false);
}

export function verifyAdminButtons() {
  const visibility = checkFooterButtonVisibility();

  expect(visibility.comments).toBe(true);
  expect(visibility.download).toBe(true);
  expect(visibility.validate).toBe(true);
  expect(visibility.assign).toBe(true);
  expect(visibility.publish).toBe(true);
}

interface AssignmentDialogOptions {
  role?: Role;
  userName?: string;
  expectApprovalToggle?: boolean;
  approvalState?: boolean;
}

export async function openAssignmentDialog() {
  const visibility = checkFooterButtonVisibility();
  expect(visibility.assign).toBe(true);

  const assignButton = screen.getByRole('button', { name: 'formfooter.assign' });

  expect(assignButton).toBeInTheDocument();

  await userEvent.click(assignButton);

  await waitFor(() => {
    const assignmentPanel = document.querySelector('.assignment-panel') as HTMLElement;
    expect(assignmentPanel).toBeInTheDocument();
    expect(within(assignmentPanel).getByText('assignment.chooseRoleOrUser')).toBeVisible();
  });
}

export async function canOpenAssignmentDialog(): Promise<boolean> {
  const assignButton = screen.queryByRole('button', { name: 'formfooter.assign' });
  return assignButton !== null;
}

export async function assignToRole(options: AssignmentDialogOptions) {
  const { role, userName, expectApprovalToggle, approvalState } = options;

  const assignmentPanel = document.querySelector('.assignment-panel') as HTMLElement;
  expect(assignmentPanel).toBeInTheDocument();

  if (expectApprovalToggle && approvalState !== undefined) {
    const approvalSwitch = screen.getByRole('switch', { name: 'assignment.reviewStatus' });

    const currentState = approvalSwitch.getAttribute('aria-checked') === 'true';

    if (currentState !== approvalState) {
      await userEvent.click(approvalSwitch);

      await waitFor(() => {
        expect(approvalSwitch).toHaveAttribute('aria-checked', approvalState ? 'true' : 'false');
      });
    }
  }

  if (userName) {
    const userButton = screen.getByRole('button', { name: new RegExp(userName, 'i') });
    await userEvent.click(userButton);
  } else if (role) {
    const roleMap: Record<Role, string> = {
      MdeEditor: 'assignment.handoverToRole',
      MdeDataOwner: 'assignment.handoverToRole',
      MdeQualityAssurance: 'assignment.handoverToRole',
      MdeAdministrator: 'assignment.handoverToRole'
    };

    const roleButton = screen.getByText(roleMap[role]);
    await userEvent.click(roleButton);
  }

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('role'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          role: role
        }),
        headers: {
          'content-type': 'application/json'
        }
      })
    );
  });

  await waitFor(
    () => {
      expect(document.querySelector('.assign-panel') as HTMLElement).not.toBeInTheDocument();
    },
    { timeout: 3000 }
  );
}

export async function assignToSelf(userId: string) {
  const visibility = checkFooterButtonVisibility();
  expect(visibility.assign).toBe(true);

  const selfAssignButton = screen.getByRole('button', { name: 'assignment.assignToMe' });

  expect(selfAssignButton).toBeInTheDocument();

  await userEvent.click(selfAssignButton);

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('user'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          userId: userId
        }),
        headers: {
          'content-type': 'application/json'
        }
      })
    );
  });

  await waitFor(
    () => {
      expect(document.querySelector('.assign-panel') as HTMLElement).not.toBeInTheDocument();
    },
    { timeout: 3000 }
  );
}

export async function unassignFromSelf() {
  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  const unassignButton = screen.getByRole('button', { name: 'assignment.unassign' });
  await userEvent.click(unassignButton);

  await waitFor(
    () => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    },
    { timeout: 3000 }
  );
}

export async function openValidationDialog() {
  const validateButton = screen.getByRole('button', { name: 'formfooter.validate' });

  expect(validateButton).toBeInTheDocument();

  await userEvent.click(validateButton);

  await waitFor(() => {
    const validatePanel = document.querySelector('.validation-content') as HTMLElement;
    expect(validatePanel).toBeInTheDocument();
    expect(
      within(validatePanel).getByRole('button', { name: 'validationdialog.start' })
    ).toBeVisible();
  });
}

export async function canOpenValidationDialog(): Promise<boolean> {
  const validateButton = screen.queryByRole('button', { name: 'formfooter.validate' });
  return validateButton !== null;
}

export async function startValidation() {
  await waitFor(() => {
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  const startButton = screen.getByRole('button', { name: 'validationdialog.start' });
  await userEvent.click(startButton);

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('validate'),
      expect.objectContaining({
        method: 'GET'
      })
    );
  });

  await waitFor(() => {
    expect(screen.queryByText('validationdialog.startFailed')).not.toBeInTheDocument();
    expect(screen.queryByText('validationdialog.failed')).not.toBeInTheDocument();
  });
}

export async function waitForValidationComplete(timeout = 10000) {
  await waitFor(
    () => {
      const dialog = screen.getByRole('dialog');
      const resultsText = within(dialog).queryByText('validationdialog.results');
      const noErrorsText = within(dialog).queryByText('validationdialog.noErrors');
      const errorText = within(dialog).queryByText('validationdialog.failed');

      expect(resultsText || noErrorsText || errorText).toBeInTheDocument();
    },
    { timeout }
  );
}

export async function openPublishDialog() {
  const publishButton = screen.getByRole('button', { name: 'formfooter.publish' });

  expect(publishButton).toBeInTheDocument();

  await userEvent.click(publishButton);

  await waitFor(() => {
    const publishPanel = document.querySelector('.publish-content') as HTMLElement;
    expect(publishPanel).toBeInTheDocument();
    expect(
      within(publishPanel).getByRole('button', { name: 'publishdialog.action' })
    ).toBeVisible();
  });
}

export async function canOpenPublishDialog(): Promise<boolean> {
  const publishButton = screen.queryByRole('button', { name: 'formfooter.publish' });
  return publishButton !== null;
}

export async function publishMetadata() {
  await waitFor(() => {
    expect(document.querySelector('.publish-content') as HTMLElement).toBeInTheDocument();
  });

  const publishButton = screen.getByRole('button', { name: 'publishdialog.action' });

  expect(publishButton).not.toBeDisabled();

  await userEvent.click(publishButton);

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('publish'),
      expect.objectContaining({
        method: 'POST'
      })
    );
  });

  await waitFor(
    () => {
      expect(screen.getByText('publishdialog.success')).toBeInTheDocument();
    },
    { timeout: 5000 }
  );
}

export async function checkPublishPreconditions() {
  await waitFor(() => {
    expect(document.querySelector('.publish-content') as HTMLElement).toBeInTheDocument();
  });

  const dialog = document.querySelector('.publish-content') as HTMLElement;

  const approvedItem = within(dialog).getByText('publishdialog.approved');
  const hasApprovalCheck = approvedItem.classList.contains('check');

  const editorItem = within(dialog).getByText('publishdialog.editor');
  const hasEditorCheck = editorItem.classList.contains('check');

  return {
    isApproved: hasApprovalCheck,
    isAssignedToEditor: hasEditorCheck,
    canPublish: hasApprovalCheck && hasEditorCheck
  };
}

export async function approveMetadata() {
  const approvalSwitch = screen.getByRole('switch', { name: 'assignment.reviewStatus' });
  await waitFor(() => {
    expect(approvalSwitch).toBeInTheDocument();
  });

  await userEvent.click(approvalSwitch);

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('approved'),
      expect.objectContaining({
        method: 'POST'
      })
    );
  });
}

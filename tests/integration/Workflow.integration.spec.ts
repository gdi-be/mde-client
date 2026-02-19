import {
  describe,
  it,
  expect,
  beforeEach
} from 'vitest';

import { render } from '@testing-library/svelte';

import FormHarness from '../helpers/FormHarness.svelte';
import {
  resetTestMetadata,
  setMockRoles,
  setMockUserId
} from '../setup';
import metadata1 from '../fixtures/metadata1';
import {
  checkFooterButtonVisibility,
  verifyDataOwnerButtons,
  verifyEditorButtons,
  verifyQAButtons,
  verifyAdminButtons,
  openAssignmentDialog,
  assignToRole,
  assignToSelf,
  openValidationDialog,
  startValidation,
  openPublishDialog,
  checkPublishPreconditions,
  publishMetadata,
  approveMetadata
} from '../helpers/TestWorkflowHelpers';

const TEST_USER_ID = '9282dbab-a97d-44fa-8f06-042ab34f6de6';

describe('Metadata Workflow - Integration test', () => {
  beforeEach(() => {
    resetTestMetadata(metadata1);
    setMockUserId(TEST_USER_ID);
  });

  describe('Button Visibility by Role', () => {
    it('DataOwner should see correct buttons', () => {
      setMockRoles(['MdeDataOwner']);

      render(FormHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: TEST_USER_ID,
            responsibleRole: 'MdeDataOwner'
          }
        }
      });

      verifyDataOwnerButtons();
    });

    it('Editor (not assigned) should see limited buttons', () => {
      setMockRoles(['MdeEditor']);

      render(FormHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: 'someone-else',
            responsibleRole: 'MdeDataOwner',
            approved: false
          }
        }
      });

      const visibility = checkFooterButtonVisibility();
      expect(visibility.assign).toBe(false);
      expect(visibility.publish).toBe(false);
    });

    it('Editor (assigned, approved, valid) should see all buttons', () => {
      setMockRoles(['MdeEditor']);

      render(FormHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: TEST_USER_ID,
            approved: true,
            responsibleRole: 'MdeEditor'
          }
        }
      });

      verifyEditorButtons(true, true, true);
    });

    it('QA should see correct buttons', () => {
      setMockRoles(['MdeQualityAssurance']);

      render(FormHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: 'current-user-id',
            responsibleRole: 'MdeQualityAssurance'
          }
        }
      });

      verifyQAButtons(true);
    });

    it('Administrator should see all buttons', () => {
      setMockRoles(['MdeAdministrator']);

      render(FormHarness, {
        props: { metadata: metadata1 }
      });

      verifyAdminButtons();
    });
  });

  describe('Role-based Workflow', () => {
    it('DataOwner workflow: assign to Editor', async () => {
      setMockRoles(['MdeDataOwner']);

      const { unmount } = render(FormHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: TEST_USER_ID,
            responsibleRole: 'MdeDataOwner'
          }
        }
      });

      await openAssignmentDialog();
      await assignToRole({ role: 'MdeEditor' });

      unmount();
    });

    it('Editor workflow: validate and assign to QA', async () => {
      setMockRoles(['MdeEditor']);

      const { unmount } = render(FormHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: TEST_USER_ID,
            responsibleRole: 'MdeEditor'
          }
        }
      });

      await openValidationDialog();
      await startValidation();

      await openAssignmentDialog();
      await assignToRole({ role: 'MdeQualityAssurance' });

      unmount();
    });

    it('QA workflow: approve and assign back to Editor', async () => {
      setMockRoles(['MdeQualityAssurance']);

      const { unmount } = render(FormHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: TEST_USER_ID,
            responsibleRole: 'MdeQualityAssurance',
            approved: false
          }
        }
      });

      await openAssignmentDialog();

      await approveMetadata()

      await assignToRole({
        role: 'MdeEditor',
        expectApprovalToggle: true,
        approvalState: true
      });

      unmount();
    });

    it('Editor workflow: publish approved metadata', async () => {
      setMockRoles(['MdeEditor']);

      const { unmount } = render(FormHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: TEST_USER_ID,
            responsibleRole: 'MdeEditor',
            approved: true
          }
        }
      });

      const visibility = checkFooterButtonVisibility();
      expect(visibility.publish).toBe(true);

      await openPublishDialog();

      const preconditions = await checkPublishPreconditions();
      expect(preconditions.canPublish).toBe(true);

      await publishMetadata();

      unmount();
    });
  });

  describe('Complete Multi-Role Workflow', () => {
    it('should complete full lifecycle with role changes', async () => {
      // Step 1: DataOwner assigns to self
      setMockRoles(['MdeDataOwner']);

      let { unmount } = render(FormHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: null,
            responsibleRole: 'MdeDataOwner'
          }
        }
      });

      await openAssignmentDialog();
      await assignToSelf(TEST_USER_ID);
      unmount();

      // Step 2: DataOwner assigns to Editor
      setMockRoles(['MdeDataOwner']);

      ({ unmount } = render(FormHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: TEST_USER_ID,
            responsibleRole: 'MdeDataOwner'
          }
        }
      }));

      await openAssignmentDialog();
      await assignToRole({ role: 'MdeEditor' });
      unmount();

      // Step 3: Editor validates 
      setMockRoles(['MdeEditor']);

      ({ unmount } = render(FormHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: TEST_USER_ID,
            responsibleRole: 'MdeEditor'
          }
        }
      }));

      await openValidationDialog();
      await startValidation();

      unmount();

      // Step 4: Editor assigns to QA
      ({ unmount } = render(FormHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: TEST_USER_ID,
            responsibleRole: 'MdeEditor'
          }
        }
      }));

      await openAssignmentDialog();
      await assignToRole({ role: 'MdeQualityAssurance' });
      unmount();

      // Step 5: QA approves
      setMockRoles(['MdeQualityAssurance']);

      ({ unmount } = render(FormHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: TEST_USER_ID,
            responsibleRole: 'MdeQualityAssurance',
            approved: false
          }
        }
      }));

      await approveMetadata()

      await openAssignmentDialog();

      await assignToRole({
        role: 'MdeEditor',
        expectApprovalToggle: true,
        approvalState: true
      });
      unmount();

      // Step 6: Editor publishes
      setMockRoles(['MdeEditor']);

      ({ unmount } = render(FormHarness, {
        props: {
          metadata: {
            ...metadata1,
            assignedUserId: TEST_USER_ID,
            responsibleRole: 'MdeEditor',
            approved: true
          }
        }
      }));
      const visibility = checkFooterButtonVisibility();
      expect(visibility.publish).toBe(true);

      await openPublishDialog();
      const preconditions = await checkPublishPreconditions();
      expect(preconditions.isApproved).toBe(true);
      expect(preconditions.isAssignedToEditor).toBe(true);

      await publishMetadata();

      unmount();
    });
  });
});
